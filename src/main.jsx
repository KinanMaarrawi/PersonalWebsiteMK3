import { createRoot } from 'react-dom/client';
import './index.css';
import { StrictMode } from 'react';
import { App } from './App.jsx';
import { LanguageProvider } from './LanguageContext.jsx';
import { SiteContentProvider } from './SiteContentContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </LanguageProvider>
  </StrictMode>
);
