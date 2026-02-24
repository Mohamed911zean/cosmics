import type { Order } from "@/stores/ecommerceStores/useOrderStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Telegram Notification Utility

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || import.meta.env.VITE_FALLBACK_BOT_TOKEN;

/**
 * Gets the secondary chat ID from environment variables, Firestore, or LocalStorage.
 */
export const getSecondaryChatId = async (): Promise<string> => {
    // 1. Check Environment Variable
    const envId = import.meta.env.VITE_TELEGRAM_SECONDARY_CHAT_ID;
    if (envId && envId !== "YOUR_SECONDARY_CHAT_ID") return envId;

    // 2. Check Firestore
    try {
        const docRef = doc(db, "settings", "telegram");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().secondaryChatId) {
            return docSnap.data().secondaryChatId;
        }
    } catch (e) {
        console.warn("⚠️ Could not fetch secondary chat ID from Firestore", e);
    }

    // 3. Check LocalStorage (Fallback)
    return localStorage.getItem('telegram_secondary_chat_id') || "";
};

/**
 * Saves the secondary chat ID to LocalStorage and Firestore.
 */
export const setSecondaryChatId = async (id: string): Promise<void> => {
    localStorage.setItem('telegram_secondary_chat_id', id);
    try {
        await setDoc(doc(db, "settings", "telegram"), { secondaryChatId: id }, { merge: true });
    } catch (e) {
        console.error("❌ Failed to save secondary Chat ID to Firestore", e);
    }
};

export const checkBotUpdates = async () => {
    if (!TELEGRAM_BOT_TOKEN) throw new Error("Telegram Bot Token is missing in environment variables.");
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.ok) {
            throw new Error(data.description || "Failed to fetch updates from Telegram API");
        }
        
        return data.result;
    } catch (error) {
        console.error("❌ Error checking bot updates:", error);
        throw error;
    }
};

const sendWithRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            const delay = 1000 * (i + 1);
            console.warn(`🔄 Retry ${i + 1}/${retries} for Telegram notification (waiting ${delay}ms)...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("Retry logic failed");
};

const sendToSingleChat = async (chatId: string, message: string, recipientName: string): Promise<boolean> => {
    if (!chatId) {
        console.warn(`⚠️ Skipping ${recipientName} - Chat ID not configured`);
        return false;
    }
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        await sendWithRetry(async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                }),
                signal: controller.signal,
                keepalive: true
            });

            clearTimeout(timeoutId);
            const result = await response.json();
            
            if (!result.ok) {
                throw new Error(result.description || "Telegram API error");
            }
            return result;
        });
        
        console.log(`✅ Telegram notification sent to ${recipientName} (${chatId})`);
        return true;
        
    } catch (error) {
        console.error(`❌ Failed to send to ${recipientName} (${chatId}):`, error);
        
        try {
            const params = new URLSearchParams({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            });
            const fallbackUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?${params.toString()}`;
            fetch(fallbackUrl).catch(() => {});
            console.log(`📮 Fallback GET request sent to ${recipientName}`);
        } catch (fallbackError) {
            // Silently fail fallback
        }
        
        return false;
    }
};

export const sendTelegramOrderNotification = async (order: Order | any) => {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error("❌ Telegram Bot Token not found. Notifications disabled.");
        return;
    }

    const { shippingDetails, items, total, id } = order;
    
    // 1. Primary Chat (from Env)
    const primaryChatId = import.meta.env.VITE_TELEGRAM_PRIMARY_CHAT_ID;
    
    // 2. Secondary Chat (Dynamic)
    const secondaryChatId = await getSecondaryChatId();

    const recipients = [
        { name: "Primary Admin", chatId: primaryChatId },
        { name: "Secondary Admin", chatId: secondaryChatId }
    ].filter((r, index, self) => 
        r.chatId && 
        r.chatId !== "YOUR_PRIMARY_CHAT_ID" && 
        r.chatId !== "YOUR_SECONDARY_CHAT_ID" &&
        self.findIndex(t => t.chatId === r.chatId) === index // Avoid duplicates
    );

    if (recipients.length === 0) {
        console.warn("⚠️ No valid recipients configured for Telegram notifications.");
        return;
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
    const tax = total - subtotal;

    const itemsList = items.map((item: any, index: number) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const qty = item.quantity || 1;
        return `${index + 1}. <b>${item.name}</b>\n   الكمية: ${qty} x ${price.toFixed(2)} ج.م`;
    }).join('\n');

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

    console.log(`📤 Sending Telegram notifications to ${recipients.length} recipients...`);

    const results = await Promise.allSettled(
        recipients.map(recipient => 
            sendToSingleChat(recipient.chatId, message, recipient.name)
        )
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    console.log(`📊 Notification summary: ${successful}/${recipients.length} successful`);
};
