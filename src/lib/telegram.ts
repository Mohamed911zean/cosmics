import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Telegram Notification Utility

const FALLBACK_BOT_TOKEN = "8470446860:AAEeM1nbRlLoMvgAkv1tbWti5x5_pxyeUPA";
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || FALLBACK_BOT_TOKEN;

// ✅ Chat ID الأساسي (بتاعك) - هيبعتله دايماً
const PRIMARY_CHAT_ID = "5931162186"; // ✅ حط Chat ID بتاعك هنا

// ✅ جلب Chat ID الإضافي (بتاع صاحبك أو أي حد تاني)
export const getSecondaryChatId = async () => {
    // 1. Check Env
    if (import.meta.env.VITE_TELEGRAM_SECONDARY_CHAT_ID) {
        return import.meta.env.VITE_TELEGRAM_SECONDARY_CHAT_ID;
    }

    // 2. Check Firestore
    try {
        const docRef = doc(db, "settings", "telegram");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().secondaryChatId) {
            return docSnap.data().secondaryChatId;
        }
    } catch (e) {
        console.log("Error fetching secondary chat ID from Firestore", e);
    }

    // 3. Check LocalStorage
    return localStorage.getItem('telegram_secondary_chat_id') || "";
};

export const setSecondaryChatId = async (id: string) => {
    localStorage.setItem('telegram_secondary_chat_id', id);
    try {
        await setDoc(doc(db, "settings", "telegram"), { secondaryChatId: id }, { merge: true });
    } catch (e) {
        console.error("Failed to save secondary Chat ID to Firestore", e);
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
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

// ✅ دالة لإرسال رسالة لـ Chat ID واحد
const sendToSingleChat = async (chatId: string, message: string): Promise<boolean> => {
    if (!chatId) return false;
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const data = await sendWithRetry(async () => {
            return await Promise.race([
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
                    keepalive: true
                }).then(async (res) => {
                    const result = await res.json();
                    if (!result.ok) {
                        throw new Error(result.description || "Failed to send Telegram message");
                    }
                    return result;
                }),
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout after 8 seconds')), 8000)
                )
            ]);
        });
        
        console.log(`✅ Telegram notification sent to ${chatId}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Failed to send to ${chatId}:`, error);
        
        // Fallback
        try {
            const beaconUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?${new URLSearchParams({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })}`;
            
            fetch(beaconUrl).catch(() => {});
            console.log(`📮 Fallback sent to ${chatId}`);
        } catch (beaconError) {
            console.error(`❌ All methods failed for ${chatId}`);
        }
        
        return false;
    }
};

// ✅ دالة الإرسال الرئيسية - بتبعت لكل الـ Chat IDs
export const sendTelegramOrderNotification = async (order: any) => {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn("Telegram Bot Token not found. Skipping notification.");
        return;
    }

    const { shippingDetails, items, total, id } = order;

    console.log("📤 Sending Telegram notifications for order:", id);
    
    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
    const tax = total - subtotal;

    // Format Items List
    const itemsList = items.map((item: any, index: number) => {
        return `${index + 1}. <b>${item.name}</b>\n   الكمية: ${item.quantity || 1} x ${item.price.toFixed(2)} ج.م`;
    }).join('\n');

    // Construct Message
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

    // ✅ جمع كل الـ Chat IDs
    const chatIds: string[] = [];
    
    // 1. Primary Chat ID (بتاعك - دايماً)
    if (PRIMARY_CHAT_ID) {
        chatIds.push(PRIMARY_CHAT_ID);
        console.log(`📋 Primary recipient: ${PRIMARY_CHAT_ID}`);
    }
    
    // 2. Secondary Chat ID (بتاع صاحبك - اختياري)
    const secondaryChatId = await getSecondaryChatId();
    if (secondaryChatId && secondaryChatId !== PRIMARY_CHAT_ID) {
        chatIds.push(secondaryChatId);
        console.log(`📋 Secondary recipient: ${secondaryChatId}`);
    }

    if (chatIds.length === 0) {
        console.warn("⚠️ No Chat IDs configured. Skipping notification.");
        return;
    }

    // ✅ إرسال للجميع بالتوازي
    const results = await Promise.allSettled(
        chatIds.map(chatId => sendToSingleChat(chatId, message))
    );

    // ✅ تقرير النتائج
    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.length - successful;

    console.log(`📊 Notification sent to ${successful}/${chatIds.length} recipients (${failed} failed)`);
    
    if (successful === 0) {
        console.warn("⚠️ All notifications failed, but order was saved");
    }
};