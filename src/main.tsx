import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Note: Firebase Auth redirect result is automatically processed by onAuthStateChanged in App.tsx
// No need to manually call getRedirectResult here - Firebase SDK handles this internally

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
