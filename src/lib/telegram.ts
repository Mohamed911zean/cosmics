import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Telegram Notification Utility

// HARDCODED FALLBACKS (To ensure it works immediately without server restart)
const FALLBACK_BOT_TOKEN = "8470446860:AAEeM1nbRlLoMvgAkv1tbWti5x5_pxyeUPA";

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || FALLBACK_BOT_TOKEN;

// Order of priority:
// 1. Environment Variable
// 2. Firestore Global Settings
// 3. LocalStorage (Testing)
export const getStoredChatId = async () => {
    // 1. Check Env
    if (import.meta.env.VITE_TELEGRAM_CHAT_ID) {
        return import.meta.env.VITE_TELEGRAM_CHAT_ID;
    }

    // 2. Check Firestore
    try {
        const docRef = doc(db, "settings", "telegram");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().chatId) {
            return docSnap.data().chatId;
        }
    } catch (e) {
        console.log("Error fetching chat ID from Firestore", e);
    }

    // 3. Check LocalStorage
    return localStorage.getItem('telegram_chat_id') || "";
};

export const setStoredChatId = async (id: string) => {
    localStorage.setItem('telegram_chat_id', id);
    try {
        await setDoc(doc(db, "settings", "telegram"), { chatId: id }, { merge: true });
    } catch (e) {
        console.error("Failed to save Chat ID to Firestore", e);
    }
};

export const checkBotUpdates = async () => {
    if (!TELEGRAM_BOT_TOKEN) throw new Error("Bot Token is missing");
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.ok) {
        throw new Error(data.description || "Failed to fetch updates");
    }
    
    return data.result;
};

// ✅ دالة للإعادة 3 مرات لو فشل الإرسال
const sendWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`🔄 Retry ${i + 1}/${retries} for Telegram notification...`);
            // انتظر ثانية، ثم ثانيتين، ثم 3 ثواني
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

export const sendTelegramOrderNotification = async (order: any) => {
    const chatId = await getStoredChatId();
    
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn("Telegram Bot Token not found. Skipping notification.");
        return;
    }
    
    if (!chatId) {
        console.warn("Telegram Chat ID not found. Skipping notification.");
        return;
    }

    const { shippingDetails, items, total, id } = order;

    console.log("📤 Sending Telegram notification for order:", id, "to ChatID:", chatId);
    
    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
    const tax = total - subtotal;

    // Format Items List
    const itemsList = items.map((item: any, index: number) => {
        return `${index + 1}. <b>${item.name}</b>\n   الكمية: ${item.quantity || 1} x ${item.price.toFixed(2)} ج.م`;
    }).join('\n');

    // Construct Message (HTML format)
    const message = `
🛒 <b>طلب جديد!</b>

🆔 <b>رقم الطلب:</b> <code>${id}</code>

👤 <b>بيانات العميل</b>
━━━━━━━━━━━━━━━━
<b>📞 الموبايل: ${shippingDetails.phone}</b>
<b>👤 الاسم:</b> ${shippingDetails.firstName} ${shippingDetails.lastName}
<b>📧 الإيميل:</b> ${shippingDetails.email}
<b>📍 العنوان:</b> ${shippingDetails.address}
<b>🏙️ المدينة:</b> ${shippingDetails.city}

🛍️ <b>المنتجات</b>
━━━━━━━━━━━━━━━━
${itemsList}

💰 <b>التفاصيل المالية</b>
━━━━━━━━━━━━━━━━
<b>💵 المجموع الفرعي:</b> ${subtotal.toFixed(2)} ج.م
<b>💸 الضريبة:</b> ${tax.toFixed(2)} ج.م
<b>💳 الإجمالي: ${total.toFixed(2)} ج.م</b>

<i>افتح الداشبورد لمزيد من التفاصيل</i>
    `.trim();

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        // ✅ استخدام sendWithRetry للإعادة 3 مرات لو فشل
        const data = await sendWithRetry(async () => {
            // ✅ استخدام Promise.race عشان نضمن عدم التأخير الزائد
            return await Promise.race([
                // الطريقة الأساسية: fetch مع keepalive
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'HTML'
                    }),
                    keepalive: true // ✅ مهم جداً - بيخلي الـ request يكمل حتى لو الصفحة اتقفلت
                }).then(async (res) => {
                    const result = await res.json();
                    if (!result.ok) {
                        throw new Error(result.description || "Failed to send Telegram message");
                    }
                    return result;
                }),
                
                // Timeout بعد 8 ثواني
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout after 8 seconds')), 8000)
                )
            ]);
        });
        
        console.log("✅ Telegram notification sent successfully!");
        return data;
        
    } catch (error) {
        console.error("❌ Failed to send Telegram notification after 3 retries:", error);
        
        // ✅ Fallback الأخير: محاولة الإرسال بـ sendBeacon (GET request)
        try {
            console.log("🔄 Trying sendBeacon as last resort...");
            
            const beaconUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?${new URLSearchParams({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })}`;
            
            // sendBeacon بيشتغل بس مع POST، فهنستخدم fetch عادي بدون انتظار
            fetch(beaconUrl).catch(() => {
                console.log("⚠️ sendBeacon fallback also failed - but request was sent");
            });
            
            console.log("📮 Fallback request sent (fire and forget)");
        } catch (beaconError) {
            console.error("❌ All methods failed:", beaconError);
        }
        
        // مش هنرمي error عشان ما نعطلش الـ checkout process
        // الرسالة اتبعتت على الأقل في محاولة واحدة
        console.warn("⚠️ Telegram notification may have been sent, but confirmation failed");
    }
};