/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält alle Funktionen und die Logik, die für die Verwaltunf und Suche von Kontakte notwendig sind.
*/

import mongoose from "mongoose";
import User from "my-mongoose-models-for-chatapp/models/UserModel.js";
import Message from "my-mongoose-models-for-chatapp/models/MessagesModel.js";


export const searchContacts = async (request, response, next) => {

    try {

        const { searchTerm } = request.body;

        //Wenn nichts zum suchen übergeben wird, dann gebe eine Fehlermeldung zurück
        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("searchTerm is required");
        }

        //Wenn der User beim suchen Sonderzeichen eingibt, wird ein Blackslash vor dem zeichen eingefügt, sodass keine Fehler auftreten.
        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        //Stellt sicher das Groß- und Kleinschreibung keinen Einfluss auf die suche haben
        const regex = new RegExp(sanitizedSearchTerm, "i");

        //Sucht in der DB den User der den Suchbegriff enthält in Vorname, Nachname oder Email.(Der aktuelle User ist ausgeschlossen)
        const contacts = await User.find({
            $and: [{ _id: { $ne: request.userId } },
            {
                $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
            },
            ],
        });

        //Gibt Erfolgsnachricht und die Kontakte als json zurück 
        return response.status(200).json({ contacts });

    } catch (error) {
        //Fange den Fehler und gebe diese aus bzw. zurück
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};



export const getContactsforDMList = async (request, response, next) => {
    try {
        //Die User-Id des Aktuellen Users wird in Objekt Id umgewandelt, da die DB diese braucht
        let { userId } = request;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                //Findet alle nachrichten, die der User gesendet oder empfangen hat
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                //Die Nachrichten werden nach zeit sortiert.
                $sort: { timestamp: -1 },
            },
            {
                //Gruppiert die Nachriten nach Konversation und holt zeit der letzten Nachricht des Gegeners
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                //holt die Kontaktdaten des Gegners
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                //"speichert" diese Kontaktdaten als ein Objekt
                $unwind: "$contactInfo",
            },
            {
                //Formatiert die Daten
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                //sortiert die Kontakte nach letzte Nachricht(nueste zurerst)
                $sort: { lastMessageTime: -1 },
            },
        ]);
        //Gibt Erfolgsnachricht und die Kontakte als json zurück 
        return response.status(200).json({ contacts });
    } catch (error) {
        //Fange den Fehler und gebe diese aus bzw. zurück
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};


export const getAllContacts = async (request, response, next) => {

    try {
        //Sucht alle User außer den aktullen User und holt nur den Vor- und Nachnamen und die id 
        const users = await User.find({ _id: { $ne: request.userId } }, "firstName lastName _id")

        //Formatiert die Daten für eine auswahl-Liste
        const contacts = users.map((user) => ({
            //Wenn der Vorname existiert wird vor und nachname als Label verwendet. Ansonsten die Email
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,

        }))

        //Gibt Erfolgsnachricht und die Kontakte als json zurück 
        return response.status(200).json({ contacts });

    } catch (error) {
        //Fange den Fehler und gebe diese aus bzw. zurück
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};