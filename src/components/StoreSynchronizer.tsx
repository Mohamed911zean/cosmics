import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { useCartStore, useWishlistStore, useOrderStore } from '@/stores';
import { updateUserData, subscribeToUserData, type UserData } from '@/lib/db';

export function StoreSynchronizer() {
    const { user, loading } = useAuth();
    const lastRemoteData = useRef<UserData | null>(null);

    useEffect(() => {
        if (loading || !user) return;

        let isInitialSync = true;

        const unsubscribeFirestore = subscribeToUserData(user.uid, (data) => {
            if (data) {
                lastRemoteData.current = data;

                const currentCart = useCartStore.getState().items;
                const remoteCart = data.cart || [];
                if (JSON.stringify(currentCart) !== JSON.stringify(remoteCart)) {
                    useCartStore.setState({ items: remoteCart });
                }

                const currentWishlist = useWishlistStore.getState().items;
                const remoteWishlist = data.wishlist || [];
                if (JSON.stringify(currentWishlist) !== JSON.stringify(remoteWishlist)) {
                    useWishlistStore.setState({ items: remoteWishlist });
                }

                const currentOrders = useOrderStore.getState().orders;
                const remoteOrders = data.orders || [];
                if (JSON.stringify(currentOrders) !== JSON.stringify(remoteOrders)) {
                    useOrderStore.setState({ orders: remoteOrders });
                }

                isInitialSync = false;
            } else {
                if (isInitialSync) {
                    const stateToSync = {
                        cart: useCartStore.getState().items,
                        wishlist: useWishlistStore.getState().items,
                        orders: useOrderStore.getState().orders
                    };

                    // Only sync if we have something to save
                    if (stateToSync.cart.length > 0 || stateToSync.wishlist.length > 0 || stateToSync.orders.length > 0) {
                        updateUserData(user.uid, stateToSync);
                    }
                    isInitialSync = false;
                }
            }
        });

        const unsubCart = useCartStore.subscribe((state) => {
            const currentItems = state.items;
            const lastRemoteCart = lastRemoteData.current?.cart || [];

            if (JSON.stringify(currentItems) !== JSON.stringify(lastRemoteCart)) {
                updateUserData(user.uid, { cart: currentItems });
            }
        });

        const unsubWishlist = useWishlistStore.subscribe((state) => {
            const currentItems = state.items;
            const lastRemoteWishlist = lastRemoteData.current?.wishlist || [];

            if (JSON.stringify(currentItems) !== JSON.stringify(lastRemoteWishlist)) {
                updateUserData(user.uid, { wishlist: currentItems });
            }
        });

        const unsubOrders = useOrderStore.subscribe((state) => {
            const currentOrders = state.orders;
            const lastRemoteOrders = lastRemoteData.current?.orders || [];

            if (JSON.stringify(currentOrders) !== JSON.stringify(lastRemoteOrders)) {
                updateUserData(user.uid, { orders: currentOrders });
            }
        });

        return () => {
            unsubscribeFirestore();
            unsubCart();
            unsubWishlist();
            unsubOrders();
        };

    }, [user, loading]);

    return null;
}
