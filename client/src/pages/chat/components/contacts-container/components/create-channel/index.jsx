/*  Veränderungsdatum: 23.03.2025 
    Diese Datei enthält die CreateChannel-Komponente, die es dem Benutzer ermöglicht, 
    einen neuen Channel zu erstellen. Der Benutzer kann einen Channel-Namen eingeben 
    und Mitglieder aus seiner Kontaktliste auswählen. Nachdem der Channel erstellt wurde, 
    wird er in der Anwendung hinzugefügt und mit anderen Benutzern über Websockets synchronisiert.
*/

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import { io, Socket } from "socket.io-client";
import { useSocket } from "@/context/SocketContext";

// Komponente zum Erstellen eines neuen Channels
const CreateChannel = () => {
  // Zustände für Modal und Formularfelder
  const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false); // Zustand für das Öffnen/Schließen des Modals
  const socket = useSocket();                                    // Holt den WebSocket-Client
  const [allContacts, setAllContacts] = useState([]);            // Zustand für alle Kontakte
  const [selectedContacts, setSelectedContacts] = useState([]);  // Zustand für ausgewählte Kontakte
  const [channelName, setChannelName] = useState("");            // Zustand für den Channel-Namen

  // useEffect Hook zum Abrufen aller Kontakte von der API
  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true })
      setAllContacts(response.data.contacts);   // Speichert die Kontakte im Zustand
    }; getData();
  }, [])

  // Funktion zum Erstellen eines Channels
  const createChannel = async () => {
    try {
      // Überprüft, ob Channel-Name und ausgewählte Kontakte vorhanden sind
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
          name: channelName,
          // Extrahiert die Mitglieder aus der Auswahl
          members: selectedContacts.map((contact) => contact.value), /*`${contact.firstName} ${contact.lastName}`) */
        }, { withCredentials: true });
        // Wenn Channel erfolgreich: Setzte alles zurück, Sende Websockets an andere Clients und füge im Zustand hinzu
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          socket.emit("addChannel", response.data.channel);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log({ error })
    }

  }

  return (
    <>
      {/* Tooltip für den Erstellen-Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}  // Öffnet das Modal bei Klick
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white" >
            Erstelle Neuen Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Dialog für das Erstellen eines neuen Channels */}
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Details für Channel</DialogTitle>
            <DialogDescription>Channel Name und Mitglieder</DialogDescription>
          </DialogHeader>
          <div>
            {/* Eingabefeld für den Channel-Namen */}
            <Input
              className="rounded-lg bg-[#2c2e3b] border-none"
              placeholder="Channel Name"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            {/* MultipleSelector zum Auswählen der Kontakte */}
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Suche Kontakte"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">No Result</p>
              }
            />
          </div>
          <div>
            {/* Button zum Erstellen des Channels */}
            <Button className="w-full bg-red-600 hover:bg-red-800 transition-all duration-300"
              onClick={createChannel}
            >Erstelle Channel</Button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}

export default CreateChannel;