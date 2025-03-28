![Logo](https://cdn.discordapp.com/attachments/1286389716551467008/1352599651718660167/ReadMeLogo.png?ex=67de9a17&is=67dd4897&hm=5981e3842374e2746a6af02917ebc2ec0b2f29e8624177fc161e42690863b8a9&)


  ## **1. Projektbeschreibung** 
  DHBW Chatty ist eine Live-Chat-App, die eine Echtzeitkommunikation mit hoher Skalierbarkeit, Sicherheit und Performance ermöglicht. Die Anwendung unterstützt Direktnachrichten, Gruppenchats, Datei- & Medienversand sowie eine Profilanpassung.

DHBW Chatty nutzt eine containerisierte Microservice-Architektur, die in Docker-Containern betrieben wird und den parallelen Einsatz mehrerer Backend-Server ermöglicht. Ein Load Balancer verteilt die Anfragen intelligent auf die verfügbaren Server, wodurch eine hohe Verfügbarkeit sichergestellt und schnelle Reaktionszeiten gewährleistet werden.

Passwort-Hashing mit bcrypt, Rate-Limiting zum Schutz vor Brute-Force-Angriffen (IP-Sperrung nach 3 mal Falscheingabe), NoSQL-Injection-Schutz durch Mongoose Sanitizer JWT-Authentifizierung gewährleisten eine sichere Kommunikation. Zudem optimiert Redis das Session-Management und die WebSocket-Verwaltung für eine reibungslose Echtzeitkommunikation.

  ## **2. Funktionen**  

####  **Benutzer-Authentifizierung**  
- **Login & Signup** mit E-Mail und Passwort  
- **Passwortanforderungen**: Mindestens **7 Zeichen** + **ein Sonderzeichen**  
- **JWT-Token-Verwaltung**: Automatische Abmeldung nach **3 Tagen**  

####  **Profilverwaltung**  
- Benutzer können **Profilbild, Hintergrundfarbe, Vorname & Nachname** anpassen  
- Änderungen werden **persistiert** und sind sofort sichtbar  

####  **Chat-Funktionalität**  
- **Direktnachrichten**: Nutzer können Kontakte suchen und private Chats starten  
- **Gruppenkanäle**: Möglichkeit, mit mehreren Nutzern zu chatten  
- **Medienversand**: Unterstützung für **Emojis, Bilder und Dateien**  
- **Live-Nachrichten**: Sofortige Synchronisation durch WebSockets  

####  **Zusätzliche Funktionen**  
- **Kontakte verwalten**: Hinzufügen & Suchen von Chat-Partnern  
- **Profilbearbeitung**: Persönliche Daten jederzeit ändern  
- **Logout-Funktion**: Sicheres Abmelden mit Löschung des JWT-Tokens  

#### **Sicherheit**
   - **Passwort-Hashing** mittels bycrypt
   - **NoSQLInjections**  mittels mongoose Sanitizer 
   - **Schutz vor BrutceForce** mittels IP-Blockung 


 ## **3. Systemarchitektur**  
Die Anwendung ist als Microservice-Architektur aufgebaut und nutzt folgende Technologien:  
- **Frontend**: React.js / Vue.js  
- **Backend**: Node.js mit Express  
- **Datenbank**: MongoDB   
- **Echtzeit-Kommunikation**: WebSockets mit Socket.io  
- **Caching**: Redis  
- **Reverse Proxy / Loadbalancer**: Nginx  
- **Deployment:** Docker
-   
## **4. Voraussetzungen** ### 
Bevor du die Anwendung startest, stelle sicher, dass folgende Abhängigkeiten installiert sind:  

- [Node.js](https://nodejs.org/) (Version 18+)  
- [Docker](https://www.docker.com/) und [Docker-Compose](https://docs.docker.com/compose/)  
- [MongoDB](https://www.mongodb.com/)   
- [Redis](https://redis.io/)  




## **5. Installation**  

### **Repository klonen**  

```sh

git clone https://github.com/Kenan-Pehlivan/LiveChatApp.git 
cd LiveChatApp

```

### **Lokale Installation**
Installiere die benötigten Abhängigkeiten jeweils in den Containern: Server und Client
```sh
cd client/server
rm -rf node_modules
npm install
```

### **Docker-Container starten**
Starte die Container und Services mit:
```sh
docker compose up -d --build
```

## **6. Nutzung**

#### **Benutzerregistrierung**

- Gehe zu http://localhost:5173
- Erstelle ein Konto mit Email und Passwort
- Erstelle dein Profil welches anderen Usern angezeigt wird

#### **Chat starten**

- Suche einen registrierten Nutzer mittels dem + bei Direct-Messages / oder erstelle einen Channel
- Sende eine Nachricht / Datei und erhalte eine Echtzeit-Antwort
- Nachrichtenverlauf wird gespeichert


## **7. Konfiguration**

Falls **externe Dienste** genutzt werden möchten *(Backend, Frontend, gehostete Datenbank, Redis, Nginx, Services)* müssen die **Ports/URLS in allen env. Dateien** entsprechend angepasst werden.

```sh
# Backend
PORT=8747
JWT_KEY="(**DWAKDPOWQEWQE*SADPWOIJQE*@())"
ORIGIN="http://localhost:5173"                          # Points on Backend
DATABASE_URL="mongodb://mongodb:27017/chat-app"        

# Redis
REDIS_URL="<Your-Redis-URL>"                            

# Frontend points on Backend
VITE_SERVER_URL = "http://localhost"
