/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält das Mongoose-Datenmodell für Benutzer, einschließlich E-Mail, Passwort, Name und Profilinformationen.
*/

/*
import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";


// Definiert das Schema für Benutzer in der Datenbank
const userSchema = new mongoose.Schema({
    // Die E-Mail-Adresse des Benutzers (erforderlich und einzigartig)
    email:{
        type:String,
        required:[true, "Email missing."],
        unique: true,
    },

    // Das Passwort des Benutzers (erforderlich)
    password:{
        type:String,
        required:[true, "Password missing."],
    },

    // Der Vorname des Benutzers (optional)
    firstName:{
        type:String,
        required:false,
    },

    // Der Nachname des Benutzers (optional)
    lastName:{
        type:String,
        required:false,
    },
    // Der Pfad zum Profilbild des Benutzers (optional)
    image:{
        type: String,
        required: false,
    },
    // Die bevorzugte Farbe des Benutzers (optional)
    color:{
        type: Number,
        required: false,
    },
    // Gibt an, ob das Profil des Benutzers vollständig eingerichtet wurde (Standardwert: false)
    profileSetup:{
        type: Boolean,
        default: false,
    },
})

// Middleware zur Verschlüsselung des Passworts vor dem Speichern
userSchema.pre("save", async function(next){
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next(); 
});

// Erstellt das Benutzermodell basierend auf dem Schema
const User = mongoose.model("Users", userSchema);

export default User;

*/