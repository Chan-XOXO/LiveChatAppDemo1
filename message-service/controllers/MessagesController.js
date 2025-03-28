/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält alle Funktionen und die Logik für das Abrufen von Nachrichten und das Hochladen von Dateien.
*/




import Message from "my-mongoose-models-for-chatapp/models/MessagesModel.js";
import { mkdirSync, renameSync } from 'fs';


// Ruft Nachrichten zwischen zwei Benutzern ab, sortiert nach Zeitstempel
export const getMessages = async (request, response, next) => {

    try {

        // Holt die Benutzer-IDs aus der Anfrage
        const user1 = request.userId;
        const user2 = request.body.id;

        // Überprüft, ob beide Benutzer-IDs vorhanden sind
        if (!user1 || !user2) {
            return response.status(400).send("Both user ID's are required");
        }

        // Sucht nach Nachrichten, die zwischen den beiden Benutzern ausgetauscht wurden, und sortiert sie nach Zeitstempel
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 }, { sender: user2, recipient: user1 }
            ],
        }).sort({ timestamp: 1 });

        // Gibt die gefundenen Nachrichten als JSON zurück
        return response.status(200).json({ messages });
    } catch (error) {
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// Handhabt den Datei-Upload und speichert die Datei im Server
export const uploadFile = async (request, response, next) => {

    try {
        // Überprüft, ob eine Datei in der Anfrage enthalten ist
        if (!request.file) {
            return response.status(400).send("File is required");
        }

        // Erstellt einen Zeitstempel für den Dateinamen
        const date = Date.now();
        // Erstellt das Verzeichnis für den Datei-Upload basierend auf dem Zeitstempel
        let fileDir = `/upload/files/${date}`
        let fileName = `${fileDir}/${request.file.originalname}`;

        // Erstellt das Verzeichnis rekursiv, falls es nicht existiert
        mkdirSync(fileDir, { recursive: true });

        renameSync(request.file.path, fileName);

        // Gibt den Pfad der hochgeladenen Datei als JSON zurück
        return response.status(200).json({ filePath: fileName });
    } catch (error) {
        //Fange den Fehler und gebe es aus bzw. zurück
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};