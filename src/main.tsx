import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker immediately for offline caching and phone installability
registerSW({ immediate: true });

const container = document.getElementById('root') || document.body.appendChild(document.createElement('div'));
container.id = 'root';

const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
