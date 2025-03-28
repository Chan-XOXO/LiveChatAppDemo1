/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält das Mongoose-Datenmodell für Kanäle, einschließlich deren Mitglieder, Nachrichten und Administratoren.
*/
/*

import mongoose from "mongoose";

// Definiert das Schema für Kanäle in der Datenbank
const channelSchema = new mongoose.Schema({
    // Der Name des Kanals (erforderlich)
    name: {
        type: String,
        required: true,

    },
    // Liste der Mitglieder des Kanals (Referenzen zu Benutzer-IDs)
    members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: true }],
    // Die ID des Administrators des Kanals
    admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
    // Nachrichten, die in diesem Kanal gesendet wurden (Referenzen zu Nachrichten-IDs)
    messages: [{
        type: mongoose.Schema.ObjectId, ref: "Messages", required: false
    }],
    // Zeitpunkt der Erstellung des Kanals
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    // Zeitpunkt der letzten Aktualisierung des Kanals
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
})

// Middleware, um das `updatedAt`-Feld vor dem Speichern zu aktualisieren
channelSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
})

// Middleware, um das `updatedAt`-Feld vor der Aktualisierung zu setzen
channelSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Channel = mongoose.model("Channels", channelSchema);
export default Channel;

*/
