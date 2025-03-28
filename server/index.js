/*  Veränderungsdatum: 21.03.2025 
    Diese Datei ist der Hauptserver für eine Node.js/Express-Anwendung.
    Sie konfiguriert, startet und verbindet den Server mit MongoDB.
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import setupSocket from "./socket.js";

//Alle Enviroment Variablen sind somit in Prosses.env (.env)
dotenv.config();

// Initialisiert die Express-Anwendung und lädt die Umgebungsvariablen
const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.set('trust proxy', 1); // Vertraut nur dem ersten Proxy

// Um die Kommunikation zwischen mehrere Servern zu erlauben, durch RestAPI methoden
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    
  })
);

//Ermöglicht den zugriff auf hochgeladene profilbilder und dateien
app.use("//upload/profiles", express.static("/upload/profiles"));
app.use("//upload/files", express.static("/upload/files"));

app.use(cookieParser());
app.use(express.json());


//Jedes mal das der Server gestartet wird, gebe diese Meldung
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//initialisiert Websockets um die Kommunikation zu ermöglichen
setupSocket(server);

// Stellt die Verbindung zur MongoDB-Datenbank her und gibt eine Fehlermeldung aus, falls die Verbindung fehlschlägt
mongoose.connect(databaseURL).then(() => console.log("DB Connection erfolgreich.")).catch(err => console.log(err.message));