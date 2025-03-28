/*  
    Veränderungsdatum: 23.03.2025 
    Diese Datei enthält die ChatHeader-Komponente, die den Header des ausgewählten Chats anzeigt.  
    Sie zeigt das Avatar des Benutzers oder Kanals sowie den Namen des Chats an und bietet eine Schaltfläche zum Schließen des Chats.  
*/

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

// Die ChatHeader-Komponente zeigt den Header des ausgewählten Chats an
const ChatHeader = () => {

  //Zugriff auf Funktionen und DAten aus App-Zustand
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      {/* Hauptcontainer des Chat-Headers mit Flexbox-Layout für die Items */}
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          {/*Avatar des Benutzers oder Kanals */}
          <div className="w-12 h-12 relative">
            {
              // Avatar des Benutzers
              selectedChatType === "contact" ? (<Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {
                  // Bild des Benutzers
                  selectedChatData.image ? (
                    <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className="object-cover w-full h-full bg-slate-800" />) : (
                    // Kein Bild dann Initialen des Benutzers
                    <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                      {selectedChatData.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()}
                    </div>
                  )}
              </Avatar>) : (
                // Symbol für einen Kanal
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">#</div>
              )}

          </div>
          <div>
            {/* Zeige den Kanalnamen */}
            {selectedChatType === "channel" && selectedChatData.name}
            {/* Wenn es ein Kontakt ist, zeige vollen Namen oder die E-Mail des Kontakts */}
            {selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
          </div>
        </div>
        {/* Schaltfläche zum Schließen des Chats */}
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            {/* Schließen-Symbol */}
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader