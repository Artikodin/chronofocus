import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/maname';

import './index.css';
import App from './App.tsx';
import { AnimationProvider } from './contexts/AnimationContext/index.tsx';
import { Signature } from './components/Signature.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimationProvider>
      <>
        <App />

        <div className="fixed bottom-0 right-0">
          <a
            className="relative z-50 flex items-end gap-2 rounded-tl-lg bg-black px-4 py-2 italic text-white"
            href="https://x.com/ArtiumWs"
            target="_blank"
          >
            by <Signature />
          </a>
          <div
            style={{
              animationDuration: '6s',
            }}
            className="absolute left-0 top-0 z-0 h-full w-full animate-pulse rounded-tl-lg shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          />
        </div>
      </>
    </AnimationProvider>
  </StrictMode>
);
