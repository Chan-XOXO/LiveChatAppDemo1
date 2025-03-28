/*  
    Veränderungsdatum: 23.03.2025
    Diese Datei enthält die Konfiguration des Axios-Clients für API-Anfragen.  
    Der Client ist mit einer Basis-URL konfiguriert und stellt eine zentrale Instanz zur Verfügung, die in der gesamten Anwendung verwendet werden kann, um HTTP-Anfragen zu stellen.  
*/

import axios from "axios";
import {HOST} from "@/utils/constants";

// Instanz Axios Client mit definierter Base_URL für all HTTP-Anfragen
export const apiClient = axios.create({
    baseURL: HOST,
});