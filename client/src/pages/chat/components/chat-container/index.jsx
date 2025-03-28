/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält den Chat-container teil der Chat Seite, bei dem ein Konkat oder Gruppenchat ausgewählt ist.
    Diese Datei importiert Elemente wie die Chat-header(wo der Name steht), Message-container(womit die vergangenen nachrichten angezeigt werden) und Message-bar(wodurch die nachrichten geschrieben und verschickt werden).
*/

import ChatHeader from "./components/chat-header"
import MessageBar from "./components/message-bar"
import MessageContainer from "./components/message-container"


const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">

      <ChatHeader />
      <MessageContainer />
      <MessageBar />

    </div>
  )
}

export default ChatContainer