/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält einen Zustandsspeicher für die User-Authentifizierung mithilfe von Zustand, einer Bibliothek für das State-Management in React.
*/

export const createAuthSlice = (set) => ({
    //Speichert die Informationen des aktuellen Users(zum start nicht definiert)
    userInfo: undefined,
    //Wird aufgerufen, wenn sich ein User einloggt oder seine Profildaten aktualisiert.(Speicher umgebenen User Daten)
    setUserInfo: (userInfo) => set({ userInfo }),
});