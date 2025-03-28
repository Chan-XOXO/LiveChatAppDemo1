/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält die Routen für die Verwaltung von Kontakten, einschließlich der Suche nach Kontakten und Abruf von Kontakten für Direktnachrichten.
*/

import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsforDMList, searchContacts } from "../controllers/ContactsController.js";

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

// Initialisiert die Routen für die Kontaktverwaltung und die Authentifizierungsmiddleware
const contactsRoutes = Router();

// Route für die Suche nach Kontakten, nur für authentifizierte Benutzer
contactsRoutes.post("/search", verifyToken, searchContacts);

// Route für das Abrufen von Kontakten für Direktnachrichten, nur für authentifizierte Benutzer
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsforDMList);

// Route für das Abrufen aller Kontakte, nur für authentifizierte Benutzer
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactsRoutes;

