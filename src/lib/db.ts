import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
