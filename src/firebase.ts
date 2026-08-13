// Firebase Core Module - SciForge AI
// Production Firebase configuration

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from "firebase/auth";

// Firebase configuration from project dashboard
const firebaseConfig = {
  apiKey: "AIzaSyAv4zqp9_2RRdlSGLSy7GOimMbhfIgqnZ8",
  authDomain: "gen-lang-client-0888593183.firebaseapp.com",
  projectId: "gen-lang-client-0888593183",
  storageBucket: "gen-lang-client-0888593183.firebasestorage.app",
  messagingSenderId: "272027003743",
  appId: "1:272027003743:web:0723abf7416e4d7a8a64ea"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Create Google Auth Provider with account selection forced
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Sign in with Google popup
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Export app for other Firebase services
export default app;