import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, RefreshCw, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { checkBotUpdates, getSecondaryChatId, setSecondaryChatId, sendTelegramOrderNotification } from "@/lib/telegram";

export function TelegramSetup() {
    const [secondaryChatId, setSecondaryChatIdState] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [updates, setUpdates] = useState<any[]>([]);
    
    useEffect(() => {
        const init = async () => {
            const id = await getSecondaryChatId();
            setSecondaryChatIdState(id);
        }
        init();
    }, []);

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

    const handleSelectChat = async (id: string, name: string) => {
        setSecondaryChatIdState(id);
        await setSecondaryChatId(id);
        toast.success(`Added ${name} as secondary recipient!`);
    };

    const handleRemoveSecondary = async () => {
        setSecondaryChatIdState("");
        await setSecondaryChatId("");
        toast.success("Secondary recipient removed");
    };

    const handleTest = async () => {
        toast.promise(
            sendTelegramOrderNotification({
                id: "TEST-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                total: 220.00,
                shippingDetails: {
                    phone: "+201234567890",
                    firstName: "محمد",
                    lastName: "زين",
                    email: "test@example.com",
                    address: "شارع السلام",
                    city: "المنصورة",
                    postalCode: "12345"
                },
                items: [
                    { name: "Test Product", price: 200.00, quantity: 1 }
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
                    <p className="text-sm text-gray-500">Manage order alert recipients</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Primary Recipient (انت) */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-sm font-semibold text-emerald-900">Primary Recipient (You)</p>
                                <p className="text-xs text-emerald-700">Chat ID: 5931162186</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">ACTIVE</span>
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">✓ All orders will be sent to this account automatically</p>
                </div>

                {/* Secondary Recipient (صاحبك) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <UserPlus className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Secondary Recipient (Optional)</p>
                            <p className="text-xs text-gray-600">Add another person to receive notifications</p>
                        </div>
                    </div>

                    {secondaryChatId ? (
                        <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                            <div>
                                <p className="text-xs text-gray-500">Chat ID:</p>
                                <p className="text-sm font-semibold text-gray-900">{secondaryChatId}</p>
                            </div>
                            <Button size="sm" variant="destructive" onClick={handleRemoveSecondary}>
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">No secondary recipient added</p>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        How to add a secondary recipient:
                    </h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                        <li>Ask them to open your bot in Telegram</li>
                        <li>They send <code>/start</code> to the bot</li>
                        <li>Click "Find Recent Chats" below</li>
                        <li>Select their name from the list</li>
                    </ol>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleCheckUpdates} disabled={isLoading}>
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Find Recent Chats
                    </Button>
                    <Button variant="secondary" onClick={handleTest}>
                        Send Test Message
                    </Button>
                </div>

                {updates.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Recent Messages</div>
                        <div className="divide-y">
                            {updates.map((update: any) => {
                                const chatId = String(update.message?.chat?.id);
                                const isSelected = chatId === secondaryChatId;
                                const isPrimary = chatId === "5931162186";
                                
                                return (
                                    <div key={update.update_id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                {update.message?.from?.first_name} {update.message?.from?.last_name}
                                                {isPrimary && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">YOU</span>}
                                                {isSelected && <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded">SELECTED</span>}
                                                <span className="text-gray-400 text-xs">@{update.message?.from?.username}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">ID: {chatId} • "{update.message?.text}"</div>
                                        </div>
                                        {!isPrimary && (
                                            <Button 
                                                size="sm" 
                                                variant={isSelected ? "default" : "ghost"}
                                                onClick={() => handleSelectChat(chatId, update.message?.from?.first_name)}
                                            >
                                                {isSelected ? <CheckCircle2 className="w-4 h-4 mr-1" /> : null}
                                                {isSelected ? "Selected" : "Select"}
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}