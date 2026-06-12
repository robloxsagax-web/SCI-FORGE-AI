import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize Firebase auth on app startup
// This handles the redirect result when users return from Google OAuth
import { getAuthRedirectResult } from './lib/firebase';

// Flag to track if redirect result has been processed
let redirectResultProcessed = false;

async function processRedirectResult() {
  if (redirectResultProcessed) return;
  redirectResultProcessed = true;
  
  try {
    // This will handle the case when user returns from Google OAuth redirect
    await getAuthRedirectResult();
  } catch (error) {
    console.error('Error processing auth redirect:', error);
  }
}

// Process redirect result on initial load
processRedirectResult();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
