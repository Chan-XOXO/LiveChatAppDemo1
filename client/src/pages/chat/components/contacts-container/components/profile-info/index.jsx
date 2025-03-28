/* 
    Veränderungsdatum: 22.03.2025
    Diese Datei enthält die ContactsContainer-Komponente, 
    die die Benutzeroberfläche für die Verwaltung von Direktnachrichten 
    und Channels in einer Chat-App darstellt.
    
    Sie ruft beim Laden die Daten von den API-Endpunkten ab (Kontakte und Channels) 
    und zeigt sie in zwei Abschnitten an: "Direct Messages" und "Channels".
    
    Zusätzlich gibt es Schaltflächen, um neue Direktnachrichten oder Channels zu erstellen. 
    Die `useEffect` Hook wird verwendet, um diese Daten beim Laden der Komponente zu laden.
    Der Zustand der Anwendung wird über useAppStore verwaltet, um die Kontakte und Channels 
    zu speichern und in der Benutzeroberfläche anzuzeigen.
*/

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LOGOUT_ROUTE } from "@/utils/constants";

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            //Sendet eine Logout Anfrage an das Backend
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            //Wenn eine Positive Antwort zurück komment, wird der User zur Auth seite weitergeleitet und die Session daten des Users werden gelöscht
            if (response.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (error) {
            //Der gefange fehler wird ausgegeben
            console.log(error)
        }
    }

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    {/* Zeigt den Profilbild untern auf der Sidebar */}
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {
                            userInfo.image ? (
                                <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full bg-black" />) : (
                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                    {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()}
                                </div>
                            )
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        //Wenn Vor- und Nachnamen des Users vorhanden, dann zeige diese an. Ansonsten zeige nichts
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                {/* Hinter dem Namen werden zwei Icon fürs Profil editieren und Logout angezeit (Tooltip zeigt informationen wenn man über einen Icon hoveret)*/}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {/* Beim klicken des Icon wird der User zur Profil Seite weitergeleitet*/}
                            <FiEdit2 className="text-gray-400 text-xl font-medium"
                                onClick={() => navigate('/profile')}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {/* Beim klicken des Icon wird die funktion logOut ausgeführt*/}
                            <IoPowerSharp className="text-red-500 text-xl font-medium"
                                onClick={logOut}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    );
};

export default ProfileInfo;