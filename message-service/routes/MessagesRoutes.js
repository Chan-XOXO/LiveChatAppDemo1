/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält die Routen für das Abrufen von Nachrichten und das Hochladen von Dateien.
*/

import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getMessages, uploadFile } from "../controllers/MessagesController.js"
import multer from "multer";


/*
export const verifyToken = async (userId, token) => {
    try {
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

// Initialisiert die Routen für Nachrichten und Datei-Uploads und bindet die Authentifizierungsmiddleware ein
const messagesRoutes =  Router();

// Konfiguration für den Datei-Upload mit Multer
const upload = multer({dest: "/upload/files"});


// Route zum Abrufen von Nachrichten, nur für authentifizierte Benutzer
messagesRoutes.post("/get-messages", verifyToken, getMessages);

// Route zum Hochladen von Dateien, nur für authentifizierte Benutzer
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default messagesRoutes