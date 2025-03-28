/*  Veränderungsdatum: 23.03.2025 
    Diese Komponente zeigt das Benutzerprofil an und ermöglicht es dem Benutzer, 
    seinen Namen, das Profilbild und die bevorzugte Farbe zu ändern. 
    Der Benutzer kann auch ein neues Profilbild hochladen oder das bestehende löschen.
    Änderungen werden auf dem Server gespeichert und das Benutzerprofil aktualisiert.
*/

import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";


// Const für die Anzeige und Bearbeitung des Benutzerprofils
const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  //Besucht man die Profile Seite nach dem Profile Setup werden die akutelle daten des Profils angezeigt
  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);      // Setzt das Profilbild
    }
  }, [userInfo]);

  // Funktion zur Validierung der Profiländerungen
  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  }

  // Funktion zum Speichern der Änderungen
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        // Sende eine Anfrage zur Aktualisierung des Profils
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, { firstName, lastName, color: selectColor }, { withCredentials: true });
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Wenn der Profile Setup fertig, dann leite zur Chat Seite weiter sonst gebe eine Fehlermeldung (Für den Arrow gedacht)
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  }

  // Funktion, um das Datei-Eingabefeld für das Hochladen eines neuen Profilbildes zu öffnen
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  // Funktion, um das Profilbild zu ändern
  const handleImageChange = async (event) => {
    const file = event.target.files[0];   // Holt die hochgeladene Datei
    console.log({ file });
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);   // Fügt die Bilddatei zu den Formulardaten hinzu
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully.");
      }
    }
  };

  // Funktion, um das Profilbild zu löschen
  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true, });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });  // Löscht das Bild aus den Benutzerdaten
        toast.success("Image removed sucessfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                image ? (
                  <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" />) : (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectColor)}`}>
                    {firstName ? firstName.split("").shift() : userInfo.email.split("").shift()}
                  </div>
                )}
            </Avatar>

            {/* Hover-Effekt für das Profilbild */}
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full" onClick={image ? handleDeleteImage : handleFileInputClick}>
                {
                  image ? (<FaTrash className="text-white text-3xl cursor-pointer" />) : (<FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
              </div>
            )
            }
            {/* Verstecktes Datei-Eingabefeld */}
            {<input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp" />
            }
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            {/* E-Mail */}
            <div className="w-full">
              <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            {/* Vorname Eingabe */}
            <div className="w-full">
              <Input placeholder="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            {/* Nachname Eingabe */}
            <div className="w-full">
              <Input placeholder="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            {/* Farbwahl */}
            <div className="w-full flex gap-5">
              {
                colors.map((color, index) => (
                  <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectColor === index ? "outline outline-white/80 " : ""} }`} key={index} onClick={() => setSelectedColor(index)}>
                  </div>))
              }
            </div>
          </div>
        </div>
        {/* Speichern-Button */}
        <div className="w-full">
          <Button className="h-16 w-full bg-red-500 hover:bg-red-900 transition-all duration-300" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>

    </div>
  )
}

export default Profile
