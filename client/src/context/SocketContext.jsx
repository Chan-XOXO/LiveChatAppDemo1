/*  
    Veränderungsdatum: 23.03.2025  
    Diese Datei enthält die SocketProvider-Komponente, die eine WebSocket-Verbindung zum Server herstellt und verwaltet.  
    Die Komponente stellt den Socket-Client für die Echtzeitkommunikation bereit und reagiert auf eingehende Nachrichten und Kanäle.  
*/

import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants"; // Stelle sicher, dass HOST korrekt definiert ist.
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

// Context für die Socket Verbindung
const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext); // Aktuellen Socket Client zu erhalten
};

// SocketProvider-Komponente, die die WebSocket-Verbindung herstellt und verwaltet. 
// Zugriff auf userInfo App-Store und Specherung Socket Verbindung Zustand
export const SocketProvider = ({ children }) => {
    const { userInfo } = useAppStore();
    const [socket, setSocket] = useState(null);

    // Wenn userInfo vorhanden stelle WebSocket Verbindung her
    useEffect(() => {
        if (userInfo) {
            const newSocket = io(HOST, {
                path: "/socket.io", // Der Pfad, unter dem der Socket-Server verfügbar ist
                withCredentials: true, // Stellt sicher, dass Cookies und andere Anmeldeinformationen gesendet werden
                query: { userId: userInfo.id }, // Übergibt die Benutzer-ID an den Server
                transports: ["websocket"], // Wählt WebSocket als Transportprotokoll (kein Polling)
                reconnection: true, // Aktiviert die automatische Wiederverbindung bei Verbindungsabbruch
                reconnectionAttempts: 5, // Maximale Anzahl an Wiederverbindungsversuchen
                reconnectionDelay: 3000, // Verzögerung in ms zwischen den Wiederverbindungsversuchen
                autoConnect: true, // Verhindert eine sofortige Verbindung beim Erstellen des Socket-Objekts
            });

            //Handler für eine erfolgreiche Verbindung zum Socket Server
            newSocket.on("connect", () => {
                console.log("✅ Verbunden mit Socket-Server:", newSocket.id);
            });

            //Handler für den Empfang von Nachrichten
            const handleRecieveMessage = (message) => {

                const { selectedChatData, selectedChatType, addMessage, setDirectMessagesContacts, directMessagesContacts, userId } = useAppStore.getState();
                // Wenn der Nachrichtensender oder Empfänger dem aktuellen Chat entspricht, wird die Nachricht hinzugefügt
                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    addMessage(message); //Nachrichten im Store hinzufügen
                }

            
                let newContact = null;
                if (message.sender._id !== userInfo.id) {
                    newContact = message.sender;
                } else if (message.recipient._id !== userInfo.id) {
                    newContact = message.recipient;
                }

                //Wenn der Konkt nicht im Zustand gibt, dann füge es ein
                if (newContact) {
                    const isAlreadyAdded = directMessagesContacts.some(c => c._id === newContact._id);
                    if (!isAlreadyAdded) {
                        setDirectMessagesContacts([...directMessagesContacts, newContact]);
                    }
                }
            };
            // Handler für den Empfang von Nachrichten in einem Kanal
            const handleRecieveChannelMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();
                // Wenn die Nachricht für den aktuellen Kanal bestimmt ist, wird sie hinzugefügt
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    addMessage(message); // Nachricht im Store hinzufügen
                }
                addChannelInChannelList(message);
            };

            // Event Listener für Nachrichten DM und Nachrichten in Kanälen
            newSocket.on("recieveMessage", handleRecieveMessage);
            newSocket.on("recieve-channel-message", handleRecieveChannelMessage);
            newSocket.on("add-channel", (channel) => {
                const { addChannel } = useAppStore.getState();
                console.log(channel); //Kanal in Konsole
                addChannel(channel); //Füge STore hinzu
            });

            //Neuer Socket Client in Zustand
            setSocket(newSocket);

            return () => {
                console.log("🔌 Socket wird getrennt...");
                newSocket.disconnect();
            };
        }
    }, [userInfo]); // Der Effekt wird ausgeführt, wenn sich die Benutzerinformationen ändern

    return (
        // Umgibt die Anwendung mit dem SocketContext.Provider, damit die Socket-Verbindung in der gesamten Anwendung verfügbar ist
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};