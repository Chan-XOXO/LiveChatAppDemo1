/*  Veränderungsdatum: 23.03.2025 
    Diese Datei enthält die ContactsContainer-Komponente, die für die Anzeige und Verwaltung 
    von Direktnachrichten und Channels in einer Chat-App verantwortlich ist. Sie lädt die 
    Kontakte und Channels des Benutzers von der API, zeigt sie in separaten Listen an 
    und ermöglicht das Erstellen neuer Direktnachrichten und Channels. 
    Am unteren Ende wird die Profilinformation des Benutzers angezeigt.
*/

import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";
import DHBWLogo from "@/assets/DHBW-Logo.svg.png";
import LogoChatapp from "@/assets/LogoChatapp.png"

// Kontakt Container (Linke Navigation)
const ContactsContainer = () => {

  // Zugriff auf Globalen Zustand
  const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels } = useAppStore();

  // Rendern Kontakte und Channels
  useEffect(() => {
    const getContacts = async () => { 
      // Abrufen der DM von API-Client, API Anfragen an Contacts Routes
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, { withCredentials: true, });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts); 
      };
    };

    // Funktion zum Abrufen der Benutzerkanäle vom API-Client
    const getChannels = async () => {
      // Abrufen der Kanäle von API-Client, API Anfragen an Channel Routes
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true });
      if (response.data.channels) {
        setChannels(response.data.channels);
      };
    };
    // Kontakte und Channels laden
    getContacts();
    getChannels();


  }, [setChannels, setDirectMessagesContacts]);

  // Layout des COntacts Container
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
       {/* Logo Bereich */}
      <div className="pt-3">
        <Logo />
      </div>
      {/* Hauptbereich für Nachrichten und Channels */}
      <div className="my-5">
        {/* Header für "Direct Messages" mit Button zum Erstellen neuer Direktnachrichten */}
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" /> 
          {/* Button, um eine neue Direktnachricht zu erstellen */}
          <NewDM />
        </div>
        {/* Anzeige der Kontaktliste für direkte Nachrichten */}
        <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
        {/* Header für "Channels" mit Button zum Erstellen eines neuen Channels */}
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Channels" />
            <CreateChannel />
          </div>
          {/* Anzeige der Channel-Liste */}
          <div className="max-h-[38vh] overflow-auto scrollbar-hidden">
            <ContactList contacts={channels} isChannel={true} />
          </div>
        </div>
      </div>
      {/* Profilinformation am unteren Ende */}
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;


const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-3 border-b-2 border-[#2c343c] w-full mb-3">
      {/* Zeigt das Logo der Chat-App */}
      <img src={LogoChatapp} alt="LogoChatapp" className="h-10 w-auto" />
      {/* Titel mit hervorheben des "DH" Textes */}
      <span className="text-2xl font-semibold">
        <span className="text-red-600">DH</span>BW-CHATTY</span>
    </div>

  );
};


const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
  )
}

