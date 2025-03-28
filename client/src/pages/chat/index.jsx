/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält die Haupt Chat Seite, die nach dem einloggen bzw. vollständig regestrieren angezeigt wird. 
    Diese Datei importiert Elemente wie die Sidebar und die tatsächlichen Chats von weitere Dateien.
*/

import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {


  const { userInfo, selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    //Wenn der User den Profile Setup nicht vollständig durchgeführt hat, dann gebe die Meldung und leite ihn zur Profile Seite.
    if (!userInfo.profileSetup) {
      toast("Please setup Profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);


  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      { //Wenn etwas hochgeladen wird, dann gebe die meldung dafür mit Fortschrittzahl
        isUploading && (<div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
        <h5 className="text-5xl animate-pulse">Uploading File</h5>
        {fileUploadProgress}%
      </div>

      )}
      { //Wenn etwas heruntergeladen wird, dann gebe die meldung dafür mit Fortschrittzahl
      isDownloading && (<div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
        <h5 className="text-5xl animate-pulse">Downloading File</h5>
        {fileDownloadProgress}%
      </div>

      )}
      {/*Es wird die Sidebar(aus index.jsx von contacts-container) mit Kontakten und Gruppenchats angezeigt. 
      Wenn kein Kontakt oder Gruppenchat ausgewählt ist, wird dem User nur Begrüßungstext angezeigt(in der index.jsx von empty-chat-container definiert). 
      Ansonsten wird der Chat des ausgewählten Kontakts bzw. Gruppenchats angezeit(in der index.jsx von chat-container definiert)*/}
      <ContactsContainer />
      {
        selectedChatType === undefined ? (<EmptyChatContainer />) : (<ChatContainer />)}


    </div>
  );
};

export default Chat;
