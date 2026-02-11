import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { checkBotUpdates, getStoredChatId, setStoredChatId, sendTelegramOrderNotification } from "@/lib/telegram";

export function TelegramSetup() {
    const [chatId, setChatId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [updates, setUpdates] = useState<any[]>([]);
    
    useEffect(() => {
        const init = async () => {
            const id = await getStoredChatId();
            setChatId(id);
        }
        init();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        await setStoredChatId(chatId);
        setIsLoading(false);
        toast.success("Chat ID saved to Database & LocalStorage!");
    };

    const handleCheckUpdates = async () => {
        setIsLoading(true);
        try {
            const results = await checkBotUpdates();
            setUpdates(results);
            
            if (results.length === 0) {
                toast.info("No messages found. Please send /start to your bot first.");
            } else {
                toast.success(`Found ${results.length} updates.`);
            }
        } catch (error: any) {
            toast.error("Failed to check updates: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChat = (id: string, name: string) => {
        setChatId(id);
        toast.success(`Selected chat for ${name}`);
    };

    const handleTest = async () => {
        if (!chatId) return toast.error("Please set a Chat ID first");
        
        toast.promise(
            sendTelegramOrderNotification({
                id: "TEST-123",
                total: 99.99,
                shippingDetails: {
                    phone: "+1234567890",
                    firstName: "Test",
                    lastName: "User",
                    email: "test@example.com",
                    address: "123 Test St",
                    city: "Test City",
                    postalCode: "12345"
                },
                items: [
                    { name: "Test Product", price: 99.99, quantity: 1 }
                ]
            }),
            {
                loading: 'Sending test message...',
                success: 'Test message sent! Check your Telegram.',
                error: 'Failed to send test message'
            }
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <Send className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Telegram Notifications</h2>
                    <p className="text-sm text-gray-500">Receive order alerts directly on your phone</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Chat ID (e.g. 123456789)" 
                        value={chatId} 
                        onChange={(e) => setChatId(e.target.value)}
                    />
                    <Button onClick={handleSave}>Save</Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        How to get your Chat ID:
                    </h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                        <li>Open your bot in Telegram</li>
                        <li>Send the message <code>/start</code> or any text</li>
                        <li>Click "Find Recent Chats" below</li>
                        <li>Select your name from the list</li>
                    </ol>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleCheckUpdates} disabled={isLoading}>
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Find Recent Chats
                    </Button>
                    <Button variant="secondary" onClick={handleTest} disabled={!chatId}>
                        Send Test Message
                    </Button>
                </div>

                {updates.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Recent Messages</div>
                        <div className="divide-y">
                            {updates.map((update: any) => (
                                <div key={update.update_id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <div className="font-medium">
                                            {update.message?.from?.first_name} {update.message?.from?.last_name} 
                                            <span className="text-gray-400 text-xs ml-2">@{update.message?.from?.username}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">ID: {update.message?.chat?.id} • "{update.message?.text}"</div>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => handleSelectChat(update.message?.chat?.id, update.message?.from?.first_name)}>
                                        Select
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
