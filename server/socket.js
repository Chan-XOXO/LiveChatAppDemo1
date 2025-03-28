/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält die Konfiguration des Socket.IO-Servers für die Echtzeitkommunikation zwischen Benutzern und Kanälen.
    Es wird Redis als Adapter verwendet, um Nachrichten effizient zwischen mehreren Servern zu verteilen.
*/

import { Server as SocketIOServer } from "socket.io";

import Message from "my-mongoose-models-for-chatapp/models/MessagesModel.js";
import Channel from "my-mongoose-models-for-chatapp/models/ChannelModel.js";
import User from "my-mongoose-models-for-chatapp/models/UserModel.js";
import { Redis } from "ioredis";
import { createShardedAdapter } from "@socket.io/redis-adapter";


export const redisPubClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379
});

export const redisSubClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379
});

// Benutzer-Sockets in Redis speichern
const userSocketMapKey = "userSocketMap";

// Setzt den Socket.IO-Server auf und verbindet ihn mit Redis für die Nachrichtenverteilung
const setupSocket = (server) => {
  // Initialisiert den Socket.IO-Server mit Redis-Adapter und CORS-Konfiguration
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
    adapter: createShardedAdapter(redisPubClient, redisSubClient.duplicate())
  });

  // Funktion zum Behandeln der Benutzer-Trennung und Entfernen des Benutzers aus Redis
  const disconnect = async (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    await redisPubClient.hdel(userSocketMapKey, userId);
  };

  // Funktion zum Senden einer Nachricht zwischen zwei Benutzern
  const sendMessage = async (message) => {
    if ((!message.content || message.content.trim() === "") && message.messageType !== "file") {
      console.error("Fehler: Nachrichteninhalt fehlt!");
      return;
    }

    const senderSocketId = await redisPubClient.hget(userSocketMapKey, message.sender);
    const recipientSocketId = await redisPubClient.hget(userSocketMapKey, message.recipient);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  // Funktion zum Senden einer Nachricht an alle Mitglieder eines Kanals
  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      for (const member of channel.members) {
        const memberSocketId = await redisPubClient.hget(userSocketMapKey, member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      };

      const adminSocketId = await redisPubClient.hget(userSocketMapKey, channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  };

  // Verbindet den Benutzer mit dem Socket.IO-Server und initialisiert Ereignisse
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      redisPubClient.hset(userSocketMapKey, userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    // Hört auf das 'sendMessage'-Ereignis und ruft die Funktion sendMessage auf
    socket.on("sendMessage", sendMessage);
    // Hört auf das 'send-channel-message'-Ereignis und ruft die Funktion sendChannelMessage auf
    socket.on("send-channel-message", sendChannelMessage);
    // Hört auf das 'addChannel'-Ereignis und sendet den Kanal an alle Mitglieder
    socket.on("addChannel", async (channel) => {
      for (const member of channel.members) {
        if (!member || !member._id) {
          console.warn("Fehlendes Mitglied oder _id:", member);
        }
        const memberSocketId = await redisPubClient.hget(userSocketMapKey, member);
        if (memberSocketId) {
          console.log(memberSocketId);
          io.to(memberSocketId).emit("add-channel", channel);
        }
      };
    });
    // Hört auf das 'disconnect'-Ereignis und ruft die Funktion disconnect auf
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;