import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { useCartStore, useWishlistStore, useOrderStore } from '@/stores';
import { updateUserData, subscribeToUserData, type UserData } from '@/lib/db';

export function StoreSynchronizer() {
    const { user, loading } = useAuth();
    const lastRemoteData = useRef<UserData | null>(null);
    const isSyncingFromRemote = useRef(false);

    useEffect(() => {
        if (loading) return;

        // If user logged out, clear stores
        if (!user) {
            useCartStore.getState().clearCart();
            useWishlistStore.getState().clearWishlist();
            useOrderStore.getState().setOrders([]);
            lastRemoteData.current = null;
            return;
        }

        let isInitialSync = true;

        // 1. Subscribe to Firestore (Remote -> Local)
        const unsubscribeFirestore = subscribeToUserData(user.uid, (data) => {
            if (data) {
                isSyncingFromRemote.current = true;
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

                isSyncingFromRemote.current = false;
                isInitialSync = false;
            } else {
                // If no remote data exists on first load, push local data to remote
                if (isInitialSync) {
                    const stateToSync = {
                        cart: useCartStore.getState().items,
                        wishlist: useWishlistStore.getState().items,
                        orders: useOrderStore.getState().orders
                    };

                    if (stateToSync.cart.length > 0 || stateToSync.wishlist.length > 0 || stateToSync.orders.length > 0) {
                        updateUserData(user.uid, stateToSync);
                    }
                    isInitialSync = false;
                }
            }
        });

        // 2. Subscribe to Local Stores (Local -> Remote)
        const unsubCart = useCartStore.subscribe((state) => {
            if (isSyncingFromRemote.current) return;
            const currentItems = state.items;
            const lastRemoteItems = lastRemoteData.current?.cart || [];

            if (JSON.stringify(currentItems) !== JSON.stringify(lastRemoteItems)) {
                updateUserData(user.uid, { cart: currentItems });
            }
        });

        const unsubWishlist = useWishlistStore.subscribe((state) => {
            if (isSyncingFromRemote.current) return;
            const currentItems = state.items;
            const lastRemoteItems = lastRemoteData.current?.wishlist || [];

            if (JSON.stringify(currentItems) !== JSON.stringify(lastRemoteItems)) {
                updateUserData(user.uid, { wishlist: currentItems });
            }
        });

        const unsubOrders = useOrderStore.subscribe((state) => {
            if (isSyncingFromRemote.current) return;
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
