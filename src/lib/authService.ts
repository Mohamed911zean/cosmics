import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Email/Password Login
export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message || 'Login failed');
    }
};

// Email/Password Signup
export const signupUser = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message || 'Signup failed');
    }
};

// Google Sign-In
export const signInWithGoogle = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error: any) {
        throw new Error(error.message || 'Google sign-in failed');
    }
};

// Logout
export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Logout failed');
    }
};

// Auth state observer
export const observeAuthState = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};