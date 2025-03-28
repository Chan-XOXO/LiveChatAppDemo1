/*  
    Veränderungsdatum: 23.03.2025 
    Diese Datei enthält die ContactList-Komponente, die eine Liste von Kontakten oder Kanälen rendert.  
    Die Komponente ermöglicht die Auswahl eines Kontakts oder Kanals, zeigt Avatare oder Initialen an  
    und unterstützt dynamisches Styling basierend auf der Auswahl.  
*/

import { useAppStore } from "@/store"
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { useEffect } from "react";

// Zeigt eine Liste von Kontakten oder Kanälen
const ContactList = ({ contacts, isChannel = false }) => {

    // Notwendige Zustände/Funktionen aus dem Globalen Store
    const { selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType, setSelectedChatMessages } = useAppStore();

    // Wenn Kontakt oder Kanal angeklickt wird
    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");

        //Aktualisierung aus Global Store
        setSelectedChatData(contact);

        // Reaload Message Empty Array wenn ein anderer Chat ausgewählt ist
        if (selectedChatData && selectedChatData._id && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    };


    return (
        <div className="mt-5">
            {/* Durch die Kontakte/Kanäle iterieren und entsprechender Avatar + Hintergrund in der linken Sidebar rendern */}
            {contacts.map((contact) => (<div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
            ${selectedChatData && (selectedChatData._id === contact._id) ? "bg-red-500 hover:bg-red-500 bg-opacity-50" : "hover:bg-red-500 bg-opacity-50"
                }`} onClick={() => handleClick(contact)} >

                <div className="flex gap-5 items-center justify-start text-neutral-300">
                    {
                        !isChannel && (<Avatar className="h-10 w-10 rounded-full overflow-hidden">
                            {
                                contact.image ? (
                                    <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" />) : (
                                    <div className={`${selectedChatData && selectedChatData._id === contact._id ? "bg-[ffffff22] border border-white/70" : getColor(contact.color)}
                                    uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                        {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
                                    </div>
                                )}
                        </Avatar>
                        )}
                    {isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">#</div>}
                    {
                        isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>
                    }

                </div>
            </div>
            ))}
            
        </div>
    )
}

export default ContactList