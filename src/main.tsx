import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/maname';

import './index.css';
import App from './App.tsx';
import { AnimationProvider } from './contexts/AnimationContext/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimationProvider>
      <App />
    </AnimationProvider>
  </StrictMode>
);
