import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { fetchOrderById, type Order } from '@/lib/orders';
import { formatEGP } from '@/lib/currency';

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

function formatOrderSummary(order: Order) {
  const lines: string[] = [];
  if (order.items.length) {
    const first = order.items[0];
    lines.push(`${first.name} — ${formatEGP(first.price)}`);
    if (order.items.length > 1) lines.push(`+ ${order.items.length - 1} more item(s)`);
  }
  lines.push(`Total: ${formatEGP(order.total)}`);

  if (order.shippingDetails.address) {
    lines.push(`Addr: ${order.shippingDetails.address}`);
  }

  return lines.join(' — ');
}

export function AdminOrderAlert() {
  const { role } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const processed = useRef(new Set<string>());
  const initialized = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (role !== 'admin' && role !== 'superadmin') return;

    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const channel = supabase
      .channel('orders-admin-inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          const id = payload.new.id as string;
          if (processed.current.has(id)) return;
          processed.current.add(id);

          // Skip first load alerts
          if (!initialized.current) return;

          try {
            const order = await fetchOrderById(id);
            if (!order) return;

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
            const summary = formatOrderSummary(order);

            // Add to notification store
            addNotification({
              id: id,
              title: 'New Order Received',
              message: summary,
              type: 'order',
              link: `/dashboard/orders/${id}`
            });

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
                  vibrate: [200, 100, 200],
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
          } catch (error) {
            console.error('Error handling new order:', error);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED' && !initialized.current) {
          initialized.current = true;
        }
      });

    // Mark as initialized after a short delay to catch initial load
    const timer = setTimeout(() => {
      initialized.current = true;
    }, 1000);

    return () => {
      clearTimeout(timer);
      channel.unsubscribe();
    };
  }, [role]);

  return null;
}