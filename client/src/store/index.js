/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält einen globalen Zustandsspeicher für eine React-App mithilfe der Zustand-Bibliothek
*/
import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice";


//Erstellt einen Zustandsspeicher, worin Auth-Daten und Chat-Daten eingefügt werden können
export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));