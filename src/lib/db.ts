import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, query, collectionGroup, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserData {
    cart?: any[];
    wishlist?: any[];
    orders?: any[];
    role?: string;
}

export const getUserData = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserData;
    } else {
        return null;
    }
};

export const updateUserData = async (uid: string, data: Partial<UserData>) => {
    const userRef = doc(db, 'users', uid);
    try {
        await setDoc(userRef, data, { merge: true });
    } catch (error) {
        console.error("Error updating user data:", error);
    }
};

export const subscribeToUserData = (uid: string, callback: (data: UserData | null) => void) => {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as UserData);
        } else {
            callback(null);
        }
    });
};

// Fetch all orders from all users (for admin dashboard)
export const getAllOrdersFromFirestore = async () => {
    try {
        const allOrders: any[] = [];
        const seenIds = new Set<string>();

        // 1. Fetch from 'users' collection documents (legacy/array format)
        try {
            const usersRef = collection(db, 'users');
            const usersSnap = await getDocs(usersRef);
            
            usersSnap.forEach((userDoc) => {
                const userData = userDoc.data() as UserData;
                if (userData.orders && Array.isArray(userData.orders)) {
                    userData.orders.forEach((order: any) => {
                        if (!order) return;
                        const id = typeof order.id === 'string' ? order.id : undefined;
                        if (!id || !seenIds.has(id)) {
                            if (id) seenIds.add(id);
                            allOrders.push(order);
                        }
                    });
                }
            });
        } catch (error) {
            console.error("Error fetching users for orders array:", error);
        }

        // 2. Fetch from 'orders' subcollections using collectionGroup (recommended format)
        try {
            const subOrdersQuery = query(collectionGroup(db, 'orders'));
            const subOrdersSnap = await getDocs(subOrdersQuery);
            
            subOrdersSnap.forEach((orderDoc) => {
                const orderData = orderDoc.data();
                if (!orderData) return;
                
                // Use doc ID as fallback if orderData.id is missing or not a string
                const id = typeof orderData.id === 'string' ? orderData.id : orderDoc.id;
                
                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allOrders.push({
                        ...orderData,
                        id: id // Ensure id is present
                    });
                }
            });
        } catch (error) {
            console.warn("Collection group 'orders' might not have an index yet or is empty:", error);
        }

        // 3. Fetch from top-level 'orders' collection (if any)
        try {
            const globalOrdersRef = collection(db, 'orders');
            const globalOrdersSnap = await getDocs(globalOrdersRef);
            
            globalOrdersSnap.forEach((orderDoc) => {
                const orderData = orderDoc.data();
                if (!orderData) return;
                
                const id = typeof orderData.id === 'string' ? orderData.id : orderDoc.id;
                
                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allOrders.push({
                        ...orderData,
                        id: id
                    });
                }
            });
        } catch {
            // Ignore if the collection doesn't exist or is inaccessible
        }

        return allOrders;
    } catch (error) {
        console.error("Critical error fetching all orders:", error);
        return [];
    }
};

export const addProductToFirestore = async (product: any) => {
    const ref = collection(db, 'products');
    await addDoc(ref, product);
};

export const getAllProductsFromFirestore = async () => {
    const ref = collection(db, 'products');
    const snap = await getDocs(ref);
    return snap.docs.map(d => ({ id: d.data().id ?? d.id, ...d.data() }));
};

export const subscribeToProducts = (callback: (products: any[]) => void) => {
    const ref = collection(db, 'products');
    return onSnapshot(ref, (snap) => {
        const items = snap.docs.map(d => ({ id: d.data().id ?? d.id, ...d.data() }));
        callback(items);
    });
};
