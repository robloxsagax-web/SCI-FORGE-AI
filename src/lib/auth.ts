// LocalStorage-based Authentication Module - SciForge AI
// Persistent user registry with localStorage synchronization

const AUTH_STORAGE_KEY = 'sciforge_auth';
const USER_REGISTRY_KEY = 'sciforge_user_registry';
const USER_STORAGE_KEY = 'sciforge_user';

export interface User {
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
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
  createdAt: new Date().toISOString()
};

// User Registry Management
function getUserRegistry(): User[] {
  try {
    const stored = localStorage.getItem(USER_REGISTRY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading user registry:', error);
  }
  return [];
}

function saveUserToRegistry(user: User): void {
  const registry = getUserRegistry();
  // Remove existing user with same email (for updates)
  const filteredRegistry = registry.filter(u => u.email !== user.email);
  filteredRegistry.push(user);
  localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(filteredRegistry));
}

function findUserInRegistry(email: string): User | null {
  const registry = getUserRegistry();
  return registry.find(u => u.email === email.toLowerCase()) || null;
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

// Sign up - Create new account and persist to registry
export function signUp(name: string, email: string, password: string): { success: boolean; error?: string } {
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

  // Check if email already exists in persistent registry
  const existingUser = findUserInRegistry(email);
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Create user and persist to registry
  const user: User = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password, // In production, this would be hashed
    createdAt: new Date().toISOString()
  };

  // Save to registry AND set as current user
  saveUserToRegistry(user);
  setUser(user);
  setAuthState({ isAuthenticated: true, user });

  // Initialize mock chats for new user
  initializeMockChats();

  return { success: true };
}

// Sign in - Validate credentials against registry
export function signIn(email: string, password: string): { success: boolean; error?: string } {
  // Always check registry first for persistent account recognition
  const user = findUserInRegistry(email);

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
  setAuthState({ isAuthenticated: false, user: null });
  // Keep user in registry for re-login without account loss
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
  localStorage.removeItem(USER_REGISTRY_KEY);
  localStorage.removeItem('sciforge_recent_sessions');
}