/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält die Routen für die Verwaltung von Kanälen, einschließlich der Erstellung von Kanälen, des Abrufens von Kanälen und Nachrichten.
*/

import { Router } from "express";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";



/*
export const verifyToken = async (userId, token) => {
    try {
        console.log("Verifying token:", token); // Debugging: Überprüfen, ob das Token korrekt ist
        const response = await axios.get("http://auth-service:8750/api/auth/verfiy-token", {
            headers: {
              Authorization: `Bearer ${token}`, // Token mitgeben
            },
            withCredentials: true,
          });
      return response.data; // Rückgabe der Benutzerdaten
    } catch (error) {
      console.error("Error fetching user from auth-service:", error);
      throw new Error("Could not fetch user data");
    }
  };*/

const channelRoutes = Router();

// Initialisiert die Kanäle-Routen und die Authentifizierungsmiddleware

// Route für die Erstellung eines neuen Kanals, nur für authentifizierte Benutzer
channelRoutes.post("/create-channel", verifyToken, createChannel);

// Route für das Abrufen aller Kanäle eines Benutzers, nur für authentifizierte Benutzer
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);

// Route für das Abrufen aller Nachrichten eines Kanals, nur für authentifizierte Benutzer
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default channelRoutes;