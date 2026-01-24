import { doc, getDoc, setDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface UserData {
    cart?: any[];
    wishlist?: any[];
    orders?: any[];
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
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);

        const allOrders: any[] = [];
        const seenIds = new Set<string>();

        usersSnap.forEach((userDoc) => {
            const userData = userDoc.data() as UserData;
            if (userData.orders && Array.isArray(userData.orders)) {
                userData.orders.forEach((order: any) => {
                    const id = typeof order?.id === 'string' ? order.id : undefined;
                    if (!id || !seenIds.has(id)) {
                        if (id) seenIds.add(id);
                        allOrders.push(order);
                    }
                });
            }
        });

        // Also check if each user has an 'orders' subcollection and aggregate those
        for (const userDoc of usersSnap.docs) {
            const subOrdersRef = collection(db, 'users', userDoc.id, 'orders');
            const subOrdersSnap = await getDocs(subOrdersRef);
            subOrdersSnap.forEach((orderDoc) => {
                const orderData = orderDoc.data();
                const id = typeof orderData?.id === 'string' ? orderData.id : orderDoc.id;
                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allOrders.push(orderData);
                }
            });
        }

        // Optional: aggregate from a top-level 'orders' collection if present
        try {
            const globalOrdersRef = collection(db, 'orders');
            const globalOrdersSnap = await getDocs(globalOrdersRef);
            globalOrdersSnap.forEach((orderDoc) => {
                const orderData = orderDoc.data();
                const id = typeof orderData?.id === 'string' ? orderData.id : orderDoc.id;
                if (!seenIds.has(id)) {
                    seenIds.add(id);
                    allOrders.push(orderData);
                }
            });
        } catch {
            // Ignore if the collection doesn't exist or is inaccessible
        }

        return allOrders;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
};
