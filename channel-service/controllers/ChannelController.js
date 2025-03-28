/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält alle Funktionen und die Logik, die für die Verwaltung von Kanälen und deren Nachrichten notwendig sind.
*/

import mongoose from "mongoose";
//import Channel from "../models/ChannelModel.js";
import Channel from "my-mongoose-models-for-chatapp/models/ChannelModel.js";
import User from "my-mongoose-models-for-chatapp/models/UserModel.js";
import Message from "my-mongoose-models-for-chatapp/models/MessagesModel.js";



export const createChannel = async (request, response, next) => {
    // Erstellt einen neuen Kanal mit einem Admin und Mitgliedern
    try {
        const { name, members } = request.body;
        const userId = request.userId;

        // Überprüft, ob der anfragende Benutzer existiert
        const admin = await User.findById(userId)

        if (!admin) {
            return response.status(400).send("Admin user not found")
        }

        // Überprüft, ob alle angegebenen Mitglieder existieren
        const validMembers = await User.find({ _id: { $in: members } })

        if (validMembers.length !== members.length) {
            return response.status(400).send("Some members are not valid users");
        }

        // Erstellt und speichert einen neuen Kanal mit dem Admin und den Mitgliedern
        const newChannel = new Channel({
            name, members, admin: userId,
        });

        await newChannel.save();

        return response.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getUserChannels = async (request, response, next) => {
    // Ruft alle Kanäle ab, in denen der Benutzer entweder Admin oder Mitglied ist
    try {
        // Konvertiert die Benutzer-ID in ein Mongoose-Objekt
        const userId = new mongoose.Types.ObjectId(request.userId);

        // Sucht nach Kanälen, in denen der Benutzer entweder als Admin oder Mitglied existiert
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });

        const admin = await User.findById(userId)

        return response.status(201).json({ channels });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getChannelMessages = async (request, response, next) => {
    // Ruft alle Nachrichten eines bestimmten Kanals ab
    try {
        const { channelId } = request.params;

        // Sucht nach dem Kanal und lädt die Nachrichten mit Sender-Details
        const channel = await Channel.findById(channelId).populate({
            path: "messages", populate: {
                path: "sender",
                select: "firstName lastName email _id image color"
            }
        });

        // Falls der Kanal nicht existiert, wird ein Fehler zurückgegeben
        if (!channel) {
            return response.status(404).send("Channel not found");
        }

        // Extrahiert die Nachrichten aus dem Kanal-Objekt
        const messages = channel.messages
        return response.status(201).json({ messages });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};