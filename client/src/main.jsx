/* Veränderungsdatum: 08.03.2025 
   Diese Datei ist der Einstiegspunkt für die React-Anwendung. 
   Sie verbindet das Root-Element mit der Anwendung und enthält den SocketProvider für WebSocket-Unterstützung 
   sowie den Toaster für Benachrichtigungen.
*/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from "./components/ui/sonner.jsx";
import { SocketProvider } from './context/SocketContext';  // Behalte ihn hier!

// Root-Element von React erstellen und die Anwendung rendern
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>

      <App />
      <Toaster closeButton />

    </SocketProvider>
  </StrictMode>
);