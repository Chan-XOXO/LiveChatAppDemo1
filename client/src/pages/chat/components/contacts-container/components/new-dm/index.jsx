/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält die Komponente NewDM, die es ermöglicht, neue Direktnachrichten (DMs) zu starten, indem man Kontakte sucht und auswählt.
*/


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {

      //Wenn es einen Suchbegriff vorliegt
      if (searchTerm.length > 0) {
        //dann wird eine API-anfrage an dem server gesendet
        const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true });
        //Wenn der Status 200 ist und Kontakte gefunden wurden, werden sie in setSearchedContacts gespeichert.
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }

      } else {
        //Ansonsten werden Suchergebnisse zurückgesetzt
        setSearchedContacts([]);
      }

    } catch (error) {
      //Fange den Fehler und gebe es aus
      console.log({ error });
    }

  };


  const selectNewContact = (contact) => {
    //Setzt den Zustand openNewContactModal auf false, sodass das Popup-Fenster zum Auswählen eines neuen Kontakts geschlossen wird.
    setOpenNewContactModal(false);
    //Setzt den aktuellen Chat auf "contact", sodass es vom Gruppenchat unterscheidet
    setSelectedChatType("contact");
    //Speichert die Informationen des ausgewählten Kontakts in setSelectedChatData.
    setSelectedChatData(contact);
    //Setzt die Suchergebnisse zurück
    setSearchedContacts([]);



  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {/* Ein Plus hinter dem DM, um neue Kontake zu suchen und zu selektieren */}
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white" >
            Suche Neuen Kontakt
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Es wird ein Popup geöffenet, wenn der obere Plus knopf gedrückt wird */}
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Wähle einen Kontakt</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* In dem Popup gibt es einen Eingabenfeld der ständig nach kontakte sucht die mit den eingebenen Daten übereinstimmen 
          --> durch die Funktion searchContacts() */}
          <div>
            <Input placeholder="Suche Kontakte" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {
            //Wenn Kontakte Gefunden würden, dann werden sie als "Auswahl-Liste" mit den Profilbildern oder Initalen(mit richige farbe) angezeit
            searchedContacts.length > 0 &&

            <ScrollArea className="h-[250px]" >
              <div className="flex flex-col gap-5">
                { //Ruft selectNewContact auf, wenn der Nutzer einen Kontakt auswählt.
                  searchedContacts.map((contact) => (<div key={contact._id} className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}>

                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {
                          contact.image ? (
                            <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black rounded-full" />) : (
                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                              {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
                            </div>
                          )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {
                          //Wenn die Gefundene Kontakte einen Vor- und Nachnamen haben, dann wird diese neben den Profilbild oder initalen angezeigt. Ansonsten wird daie Email-Adresse angezeigt
                          contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                      </span>
                      {/* Die Email wird zusätzlich in kleiner schriftgröße angezeigt */}
                      <span className="text-xs">{contact.email}</span>
                    </div>

                  </div>))
                }
              </div>
            </ScrollArea>
          }
          {/* Wenn nach keinem Kontakt gesucht wird, zeige die Lottie Animation */}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:flex flex-col mt-5 md:mt-0 justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 item-center mt-5 lg:text-2xl text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Suche Neue
                  <span className="text-red-500"> Kontakte</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </>
  )
}

export default NewDM