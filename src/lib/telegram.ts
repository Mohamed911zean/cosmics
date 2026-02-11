// Telegram Notification Utility

// You must add this to your .env file:
// VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID; // User's Chat ID

export const sendTelegramOrderNotification = async (order: any) => {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn("Telegram Bot Token not found. Skipping notification.");
        return;
    }

    const { shippingDetails, items, total, id } = order;
    
    // Calculate subtotal and tax if not provided directly
    // Assuming tax is 14% based on typical context or calculate from total
    // We will iterate items for subtotal
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
    // If total includes tax, we can infer tax, or if we have it explicitly passed.
    // For now, let's display what we have.
    const tax = total - subtotal;

    // Format Items List
    const itemsList = items.map((item: any, index: number) => {
        return `${index + 1}. <b>${item.name}</b>\n   Qty: ${item.quantity || 1} x $${item.price.toFixed(2)}`;
    }).join('\n');

    // Construct Message (HTML format)
    const message = `
🚨 <b>NEW ORDER RECEIVED!</b> 🚨
🆔 <b>Order ID:</b> <code>${id}</code>

👤 <b>CUSTOMER DETAILS</b>
━━━━━━━━━━━━━━━━
<b>📞 PHONE: ${shippingDetails.phone}</b>  <-- IMPORTANT
<b>👤 Name:</b> ${shippingDetails.firstName} ${shippingDetails.lastName}
<b>📧 Email:</b> ${shippingDetails.email}
<b>📍 Address:</b> ${shippingDetails.address}
<b>🏙️ City:</b> ${shippingDetails.city}

🛒 <b>ORDER SUMMARY</b>
━━━━━━━━━━━━━━━━
${itemsList}

💰 <b>PAYMENT DETAILS</b>
━━━━━━━━━━━━━━━━
<b>💵 Subtotal:</b> $${subtotal.toFixed(2)}
<b>💸 Tax (Est.):</b> $${tax.toFixed(2)}
<b>💳 TOTAL: $${total.toFixed(2)}</b>

<i>Please check the dashboard for more details.</i>
    `.trim();

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        // We use URLSearchParams to encode the data for a simple POST request
        // Using 'no-cors' mode allows us to send data from the browser without CORS errors,
        // but we won't get a response (opaque). This is fine for notifications.
        const params = new URLSearchParams();
        params.append('chat_id', TELEGRAM_CHAT_ID);
        params.append('text', message);
        params.append('parse_mode', 'HTML');

        // Note: fetch with no-cors and POST requires application/x-www-form-urlencoded
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        console.log("Telegram notification sent!");
    } catch (error) {
        console.error("Failed to send Telegram notification:", error);
    }
};
