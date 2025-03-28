/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält einen Zustandsspeicher für Chats mithilfe von Zustand, einer Bibliothek für das State-Management in React.
*/

export const createChatSlice = (set, get) => ({
    //Diese Werte speichern den aktuellen Zustand der Chat-Funktionalität.
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    //Diese Funktionen aktualisieren verschiedene Teile des States, wenn sich Daten ändern.
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),

    addChannel: (channel) => {
        // Validate the input
        if (!channel || !channel._id) {
          console.error("Invalid channel object");
          return;
        }
      
        // Check for duplicates
        set((state) => {
          const channelExists = state.channels.some((c) => c._id === channel._id);
          if (channelExists) {
            console.warn("Channel already exists in the list");
            return state; // Return the current state without changes
          }
      
          // Add the channel to the beginning of the array
          return { channels: [channel, ...state.channels] };
        });
      },

    //Setzt den aktuellen Chat auf “leer”, sodass kein Chat aktiv ist.
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [], }),

    //Fügt eine neue Nachricht in den Chat ein und passt die sender und empfänger IDs an, je nachdem, ob es sich um einen Channel oder eine DM handelt.
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                {
                    ...message,
                    timestamp: message.timestamp || new Date(), // Falls nicht vorhanden, Zeit setzen
                    recipient: selectedChatType === "channel"
                        ? message.recipient
                        : message.recipient?._id || message.recipient,
                    sender: selectedChatType === "channel"
                        ? message.sender
                        : message.sender?._id || message.sender,
                }
            ]
        });
    },
    //Sorgt dafür, dass der Channel, in dem gerade eine Nachricht geschrieben wurde, an den Anfang der Channel-Liste rückt.
    addChannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((channel) => channel._id === message.channelId);
        const index = channels.findIndex((channel) => channel._id === message.channelId);

        console.log(channels, data, index);            
        if (index !== -1 && data) {
            // Create a new array without mutating the original state
            const updatedChannels = [
                data, // Move the found channel to the beginning
                ...channels.slice(0, index), // Include channels before the found channel
                ...channels.slice(index + 1), // Include channels after the found channel
            ];

            // Update the state with the new array
            set({ channels: updatedChannels });
        }
    }
});
