/*  Veränderungsdatum: 08.03.2025 
    Die MessageContainer-Komponente ist für die Anzeige von Nachrichten in einem Chatraum oder einer direkten Unterhaltung verantwortlich.  
    Sie lädt Nachrichten basierend auf dem ausgewählten Chattyp (Kontakt oder Kanal), zeigt Text- und Dateinachrichten an und ermöglicht das Herunterladen von Dateien.  
    Auch Bilder können angezeigt werden, wenn der Benutzer darauf klickt. 
*/

import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";


const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false)
  const [imageURL, setImageURL] = useState(null)

  // Nachrichten für den ausgewählten Chattyp zu laden
  useEffect(() => {
    // Funktionen zum Abrufen der Nachrichten für einen direkt Kontakt
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages); // Setzen der Nachrichten im Store
        }
      } catch (error) {
        console.log({ error });
      }
    };

    // Funktionen zum Abrufen der Nachrichten für einen Kanal
    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages); // Setzen Nachrichten im Store
        }
      } catch (error) {
        console.log({ error });
      }
    }

    // Wenn ein Kontakt ausgewählt wurde, Nachrichten dieses Kontakts abrufen
    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
    //Wenn ein Kanal ausgewählt wurde, Nachrichten des Kanals abrufen
    else if (selectedChatType === "channel") {
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]); //Effekt neu ausführen bei Änderung



  // Um nach neuen Nachrichten automatisch zum neuesten Eintrag zu scrollen
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // Funktion, um zu überprüfen, ob eine Datei ein Bild ist (auf Basis der Dateiendung)
  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // Funktion zum Herunterladen von Dateien mit Fortschritt
  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted)
      }
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data])); // Blob URL
    const link = document.createElement("a"); // unsichtbarer Link für Download
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);


  }

  // Funktion zum Rendern der DMs
  const renderDMMessages = (message) => {
    return (
      <div className={`${message.sender === userInfo.id ? "text-right" : "text-left"}`}>
        {/* Textnachricht */}
        {message.messageType === "text" && (
          <div
            className={`${message.sender !== userInfo.id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 bg-[#ff4d4d]"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
          </div>
        )}
        {/* Dateinachricht */}
        {message.messageType === "file" && (
          <div
            className={`${message.sender !== selectedChatData._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 bg-[#ff4d4d]"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              // Wenn es sich um ein Bild handelt, dieses anzeigen
              <div className="cursor-pointer"

                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              // Andernfalls die Datei anzeigen und einen Download-Button hinzufügen
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => downloadFile(message.fileUrl)} >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
            <div className="text-xs text-gray-600">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        )}
        <div className="text-xs text-gray-600 mt-1">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  // Funktion zum Rendern der Kanalnachrichten 
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };


  // Funktion zum Rendern von Kanalnachrichten
  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
        {/* Überprüfen, ob die Nachricht eine Textnachricht ist */}
        {message.messageType === "text" && (
          <div
            className={`${message.sender._id === userInfo.id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 bg-[#ff4d4d]"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {/* Überprüfen, ob die Nachricht eine Datei ist */}
        {message.messageType === "file" && (
          <div
            className={`${message.sender._id === userInfo.id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 bg-[#ff4d4d]"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {/* Überprüfen, ob es sich um ein Bild handelt */}
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer"

                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}

                />
              </div>
            ) : (
              // Falls es kein Bild ist, wird die Datei als Download-Link angezeigt
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >

                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
            {/* Anzeige des Zeitstempels der Nachricht */}
            <div className="text-xs text-gray-600">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        )}

        {/* Wenn die Nachricht von einem anderen Benutzer kommt, wird der Avatar und Name angezeigt */}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            {/* Avatar des Absenders */}
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <AvatarFallback
                  className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.charAt(0)
                    : message.sender.email.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Name des Absenders */}
            <span className="text-sm text-white/60">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
            {/* Zeitstempel der Nachricht */}
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          // Falls die Nachricht vom aktuellen Benutzer kommt, nur der Zeitstempel wird angezeigt
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };



  // JSX, das die Nachrichten anzeigt
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()} {/* Rendern der Nachrichten mit der Funktion renderMessages */}
      {/* Ref für automatisches Scrollen */}
      <div ref={scrollRef}></div>
      {/* Wenn ein Bild angezeigt wird, wird es hier eingeblendet */}
      {showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
        <div>
          <img src={`${HOST}/${imageURL}`}

            className="h-[80vh] w-full bg-cover" />
        </div>
        {/* Schaltflächen für Bildaktionen */}
        <div className="flex gap-5 fixed top-0 mt-5">
          {/* Button zum Herunterladen des Bildes */}
          <button
            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            onClick={() => downloadFile(imageURL)}  // Bild herunterladen
          >
            <IoMdArrowRoundDown />
          </button>
          {/* Button zum Schließen des Bildbetrachters */}
          <button
            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            onClick={() => {
              setShowImage(false);
              setImageURL(null);
            }}
          >
            <IoCloseSharp />
          </button>
        </div>
      </div>
      }
    </div>
  );
};

export default MessageContainer;

