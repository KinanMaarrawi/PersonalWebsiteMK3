import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import NiceModal from '@ebay/nice-modal-react';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <NiceModal.Provider>
            <App />
        </NiceModal.Provider>
    </StrictMode>
);
