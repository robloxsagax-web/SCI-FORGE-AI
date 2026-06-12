// Firebase Core Module - SciForge AI
// Production Firebase configuration with Google OAuth

import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";

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
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Create Google Auth Provider with account selection forced
// This ensures users are always prompted to choose their account
// bypassing cross-origin browser security (COOP) blocks
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Sign in with Google redirect (avoids cross-origin popup issues)
export async function signInWithGoogle(): Promise<void> {
  await signInWithRedirect(auth, googleProvider);
}

// Get redirect result (call on app mount to handle returning users from redirect)
export async function getAuthRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('Error getting redirect result:', error);
    return null;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Listen to auth state changes
// Also processes redirect result internally for seamless redirect flow
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  // Firebase SDK automatically persists auth state and handles redirect results
  // The callback will be called with the user once redirect result is processed
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in after redirect
      callback(user);
    } else {
      // Check if there's a pending redirect result
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          callback(result.user);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
        callback(null);
      }
    }
  });
}

// Get current user synchronously
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Export app for other Firebase services
export default app;