/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält den Chat-container teil der Chat Seite, bei dem kein Konkat oder Gruppenchat ausgewählt ist.
*/

import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      {/*Zeigt Lottie-Animation anstelle des Chats, da nichts ausgewählt ist*/}
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      {/*Zeigt daneben auch Begrüßungstext anstelle des Chats, da nichts ausgewählt ist*/}
      <div className="text-opacity-80 text-white flex flex-col gap-5 item-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi<span className="= text-red-500">!</span> Willkommen zu
          <span className="text-red-500"> DH</span>BW-Chatty
          <span className="text-red-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer