/*  Veränderungsdatum: 08.03.2025 
    Diese Komponente definiert die Hauptstruktur der Anwendung mit Routing und Authentifizierung.
    Es gibt private Routen, die den Benutzer zur Authentifizierungsseite umleiten, wenn er nicht angemeldet ist.
    Die App verwendet einen SocketProvider für die WebSocket-Kommunikation und verwaltet den Benutzerstatus
    mit dem globalen Zustand (zuständig für das Laden von Benutzerdaten).
*/

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';  // Importiere SocketProvider
import Auth from "./pages/auth";
import Profile from './pages/profile';
import Chat from './pages/chat';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

// Routen die nur für authentifizierte Benutzer zugänglich sind
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;             // Überprüfung Authentifizierung dann Weiterleitung
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

//Routen, die nur für nicht authentifizierte Benutzer zugänglich sind
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;             // Überprüfung Authentifizierung dann Weiterleitung
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  // Daten beim Start zu laden
  useEffect(() => {
    const getUserData = async () => {
      try {
        // Versucht, Benutzerdaten von der API zu erhalten
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };
    // Wenn keine Benutzerdaten vorhanden sind, werden sie vom Server geladen
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  // Wenn noch Benutzerdaten geladen werden, wird eine Ladeanzeige angezeigt
  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <BrowserRouter> {/* Direkt ohne SocketProvider */}
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;