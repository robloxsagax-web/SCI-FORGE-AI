// LocalStorage-based Authentication Module - SciForge AI
// Persistent user registry with localStorage synchronization
// Now integrated with Firebase for Google OAuth

import { onAuthStateChange as firebaseAuthStateChange, getAuthRedirectResult, User as FirebaseUser } from './firebase';

const AUTH_STORAGE_KEY = 'sciforge_auth';
const USER_STORAGE_KEY = 'sciforge_user';
const ACCOUNTS_VAULT_KEY = 'sciforge_accounts_vault';

export interface User {
  name: string;
  email: string;
  password?: string;
  grade?: string;
  createdAt?: string;
  firebaseUid?: string;
  isFirebaseUser?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Mock data for demo - pre-filled conversations to make app feel alive
export const MOCK_CHATS = [
  {
    id: 'mock-1',
    title: 'Understanding Quantum Entanglement',
    timestamp: Date.now() - 3600000,
    messages: [
      { id: '1', sender: 'user', text: 'Can you explain quantum entanglement?', timestamp: '10:00 AM' },
      { id: '2', sender: 'bot', text: 'Quantum entanglement is a phenomenon where two particles become connected...', timestamp: '10:01 AM' }
    ]
  },
  {
    id: 'mock-2',
    title: 'Calculus Integration Techniques',
    timestamp: Date.now() - 7200000,
    messages: [
      { id: '1', sender: 'user', text: 'Help me with integration by parts', timestamp: '09:00 AM' },
      { id: '2', sender: 'bot', text: 'Integration by parts follows the formula: ∫u dv = uv - ∫v du...', timestamp: '09:01 AM' }
    ]
  },
  {
    id: 'mock-3',
    title: 'Organic Chemistry Reaction Types',
    timestamp: Date.now() - 86400000,
    messages: [
      { id: '1', sender: 'user', text: 'What are nucleophilic substitution reactions?', timestamp: 'Yesterday' },
      { id: '2', sender: 'bot', text: 'Nucleophilic substitution reactions involve a nucleophile replacing a leaving group...', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'mock-4',
    title: 'Machine Learning Neural Networks',
    timestamp: Date.now() - 172800000,
    messages: [
      { id: '1', sender: 'user', text: 'Explain backpropagation', timestamp: '2 days ago' },
      { id: '2', sender: 'bot', text: 'Backpropagation is the algorithm used to train neural networks by computing gradients...', timestamp: '2 days ago' }
    ]
  }
];

// Demo Guest Scholar user
export const DEMO_USER: User = {
  name: 'Guest Scholar',
  email: 'guest@sciforge.ai',
  grade: 'undergrad',
  createdAt: new Date().toISOString()
};

// Account Vault Management (persistent storage)
function getAccountsVault(): User[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_VAULT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading accounts vault:', error);
  }
  return [];
}

function saveAccountToVault(user: User): void {
  const accounts = getAccountsVault();
  // Remove existing account with same email (for updates)
  const filteredAccounts = accounts.filter(u => u.email !== user.email);
  filteredAccounts.push(user);
  localStorage.setItem(ACCOUNTS_VAULT_KEY, JSON.stringify(filteredAccounts));
}

function findAccountInVault(email: string): User | null {
  const accounts = getAccountsVault();
  return accounts.find(u => u.email === email.toLowerCase()) || null;
}

// Get current auth state from localStorage
export function getAuthState(): AuthState {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading auth state:', error);
  }
  return { isAuthenticated: false, user: null };
}

// Set auth state to localStorage
export function setAuthState(state: AuthState): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
}

// Get user profile from localStorage
export function getUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading user:', error);
  }
  return null;
}

// Set user profile to localStorage
export function setUser(user: User): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

// Sign up - Create new account and persist to vault
export function signUp(name: string, email: string, password: string, grade?: string): { success: boolean; error?: string } {
  // Validate inputs first
  if (!name.trim()) {
    return { success: false, error: 'Please enter your name' };
  }
  if (!email.trim() || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Check if email already exists in vault
  const existingUser = findAccountInVault(email);
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Create user and persist to vault
  const user: User = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password, // In production, this would be hashed
    grade: grade || 'grade11',
    createdAt: new Date().toISOString()
  };

  // Save to vault AND set as current user
  saveAccountToVault(user);
  setUser(user);
  setAuthState({ isAuthenticated: true, user });

  // Initialize mock chats for new user
  initializeMockChats();

  return { success: true };
}

// Sign in - Validate credentials against vault
export function signIn(email: string, password: string): { success: boolean; error?: string } {
  // Always check vault first for persistent account recognition
  const user = findAccountInVault(email);

  if (!user) {
    return { success: false, error: 'No account found. Please sign up first.' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  // Set as current logged in user
  setUser(user);
  setAuthState({ isAuthenticated: true, user });

  // Load mock chats for demo
  initializeMockChats();

  return { success: true };
}

// Demo login - Quick access for hackathon judges
export function demoLogin(): void {
  setUser(DEMO_USER);
  setAuthState({ isAuthenticated: true, user: DEMO_USER });
  initializeMockChats();
}

// Sign out - Clear auth state
export function signOut(): void {
  // Sign out from Firebase if user is a Firebase user
  const currentUser = getUser();
  if (currentUser?.isFirebaseUser) {
    import('./firebase').then(({ signOut: firebaseSignOut }) => {
      firebaseSignOut();
    });
  }
  setAuthState({ isAuthenticated: false, user: null });
  // Keep user in vault for re-login without account loss
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthState().isAuthenticated;
}

// Initialize mock chats in localStorage for demo purposes
function initializeMockChats(): void {
  const storedChats = localStorage.getItem('sciforge_recent_sessions');
  if (!storedChats) {
    localStorage.setItem('sciforge_recent_sessions', JSON.stringify(MOCK_CHATS));
  }
}

// Get mock chats
export function getMockChats() {
  try {
    const stored = localStorage.getItem('sciforge_recent_sessions');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading mock chats:', error);
  }
  return MOCK_CHATS;
}

// Clear all auth data (for testing/reset)
export function clearAuthData(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ACCOUNTS_VAULT_KEY);
  localStorage.removeItem('sciforge_recent_sessions');
}

// Firebase Auth State Synchronization
// Listens to Firebase auth state and syncs with localStorage
let firebaseSyncInitialized = false;

export function initializeFirebaseAuthSync(): void {
  if (firebaseSyncInitialized) return;
  firebaseSyncInitialized = true;

  // Listen to Firebase auth state changes
  firebaseAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // User signed in via Firebase (Google OAuth)
      const user: User = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        firebaseUid: firebaseUser.uid,
        isFirebaseUser: true,
        createdAt: new Date().toISOString()
      };
      setUser(user);
      setAuthState({ isAuthenticated: true, user });
      initializeMockChats();
      // Dispatch event for App.tsx to pick up
      window.dispatchEvent(new Event('authStateChange'));
    } else {
      // Check for pending redirect result
      const result = await getAuthRedirectResult();
      if (result?.user) {
        const firebaseUser = result.user;
        const user: User = {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          firebaseUid: firebaseUser.uid,
          isFirebaseUser: true,
          createdAt: new Date().toISOString()
        };
        setUser(user);
        setAuthState({ isAuthenticated: true, user });
        initializeMockChats();
        window.dispatchEvent(new Event('authStateChange'));
      }
    }
  });
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initializeFirebaseAuthSync();
}