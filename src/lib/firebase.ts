// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/ecommerceStores/useCartStore";
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore";
import { useProductStore } from "@/stores/ecommerceStores/useProductStore";
import { useWishlistStore } from "@/stores/ecommerceStores/useWishlistStore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-M76PJ6KGP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Global Authentication Listener
onAuthStateChanged(auth, (user) => {
  // 1. Update Auth Store
  useAuthStore.getState().setUser(user);

  // 2. Notify other stores about user change
  // This allows them to clear data on logout or prepare for sync
  useCartStore.getState().setUser(user);
  useOrderStore.getState().setUser(user);
  useProductStore.getState().setUser(user);
  useWishlistStore.getState().setUser(user);

  // Note: Actual data syncing is handled by StoreSynchronizer component
  // which provides real-time bi-directional sync with Firestore.
});