import { useEffect, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';

// External chime URL (replaceable). Short professional chime.
const CHIME_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-small-bell-ring-605.mp3';

function fallbackBeep() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 880;
        g.gain.value = 0.03;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => {
            o.stop();
            ctx.close();
        }, 200);
    } catch (e) {
        console.log('Audio API not available', e);
    }
}

function formatOrderSummary(data: any) {
    // Try to extract products array
    const products = data.products || data.items || data.cart || [];
    const lines: string[] = [];
    if (Array.isArray(products) && products.length) {
        const first = products[0];
        const name = first.name || first.title || first.productName || 'Item';
        const price = first.price ?? first.unitPrice ?? null;
        lines.push(`${name}${price ? ` — $${Number(price).toFixed(2)}` : ''}`);
        if (products.length > 1) lines.push(`+ ${products.length - 1} more item(s)`);
    } else if (data.total) {
        lines.push(`Total: $${Number(data.total).toFixed(2)}`);
    }

    if (data.address) {
        const addr = data.address.street || data.address.line1 || data.address;
        if (addr) lines.push(`Addr: ${addr}`);
    }

    return lines.join(' — ');
}

export function AdminOrderAlert() {
    const { role } = useAuthStore();
    const processed = useRef(new Set<string>());
    const initialized = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (role !== 'admin' && role !== 'superadmin') return;

        const col = collection(db, 'orders');

        const unsubscribe = onSnapshot(col, (snapshot) => {
            // On first snapshot, mark existing docs as processed to avoid alert storm
            if (!initialized.current) {
                snapshot.docs.forEach((d) => processed.current.add(d.id));
                initialized.current = true;
                return;
            }

            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const id = change.doc.id;
                    if (processed.current.has(id)) return;
                    processed.current.add(id);

                    const data = change.doc.data();

                    // Play a short professional chime (external) with fallback
                    try {
                        if (!audioRef.current) {
                            audioRef.current = new Audio(CHIME_URL);
                            audioRef.current.preload = 'auto';
                            audioRef.current.volume = 0.5;
                        }
                        audioRef.current.play().catch(() => fallbackBeep());
                    } catch (e) {
                        fallbackBeep();
                    }

                    // Build a short summary
                    const summary = formatOrderSummary(data) || `Order #${id}`;

                    // Show toast with action
                    toast.success('New order received', {
                        description: summary,
                        action: {
                            label: 'View',
                            onClick: () => (window.location.href = `/dashboard/orders/${id}`),
                        },
                    });

                    // If the user has granted browser notifications, send one
                    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                        try {
                            const n = new Notification('New Order • majestics', {
                                body: summary,
                                icon: '/android-chrome-192x192.png',
                                tag: `order-${id}`,
                                renotify: true,
                            } as NotificationOptions);
                            n.onclick = () => {
                                window.focus();
                                window.location.href = `/dashboard/orders/${id}`;
                                n.close();
                            };
                        } catch (e) {
                            console.log('Notification failed', e);
                        }
                    } else {
                        // If not granted, optionally indicate how to enable (do not auto-request)
                        // Show a subtle hint toast once
                        if (Notification && Notification.permission === 'default') {
                            toast('Enable browser notifications in your settings to get alerts while the app is in background.');
                        }
                    }
                }
            });
        });

        return () => unsubscribe();
    }, [role]);

    return null;
}