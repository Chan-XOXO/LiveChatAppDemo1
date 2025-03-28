/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält Middleware-Funktionen zur Überprüfung der Authentifizierung durch JWT-Token.
*/


import { request, response } from "express";
import jwt from "jsonwebtoken";

// Middleware zur Überprüfung des JWT-Authentifizierungstokens
export const verifyToken = (request, response, next) => {
    // Extrahiert das JWT-Token aus den Cookies
    const token = request.cookies.jwt;
    // Falls kein Token vorhanden ist, wird eine Fehlermeldung zurückgegeben
    if (!token) return response.status(401).send("You are not authenticated!");
    // Überprüft die Gültigkeit des Tokens mithilfe des geheimen Schlüssels
    jwt.verify(token, process.env.JWT_KEY, async(err,payload)=> {
        // Falls das Token ungültig ist, wird ein Fehler zurückgegeben
        if(err) return response.status(403).send("Token is not valid!");
        // Setzt die Benutzer-ID aus dem Payload in die Anfrage
        request.userId = payload.userId;
        // Fährt mit der nächsten Middleware fort, wenn das Token gültig ist
        next();
    });
};

