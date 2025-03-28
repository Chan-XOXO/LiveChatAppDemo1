// Keine explizite Verbindung notwendig, MongoDB führt das Skript automatisch gegen die Standard-Datenbank aus

db = db.getSiblingDB("chat-app"); // Stellt sicher, dass die richtige DB verwendet wird

// Nutzer-Daten importieren
db.users.insertMany([
  {
    _id: ObjectId("67c2047525e7897a7235d8ad"),
    email: "MaxMusterman@gmail.com",
    password: "$2b$10$LG4x7WPFfPQrnqoB.s9nfuWbdIF4DftROYXImTR62yRDjRnBzJCuW",
    profileSetup: true,
    color: 1,
    firstName: "Max",
    lastName: "Musterman"
  },
  {
    _id: ObjectId("67c204b425e7897a7235d8b8"),
    email: "Jakob@gmail.com",
    password: "$2b$10$7egPMFNv4z6ZOH3fETFUbONcaqJj2r.Zf8B2u3rsy7PsRbG638Bhu",
    profileSetup: true,
    color: 3,
    firstName: "Jakob",
    lastName: "Kobi"
  },
  {
    _id: ObjectId("67c204dd25e7897a7235d8c3"),
    email: "Sieger@gmail.com",
    password: "$2b$10$yIbWahIoH8D7mBQrtBnTwu/Oileps.m.rpxfk6wLOBtq/LA0obx.a",
    profileSetup: true,
    color: 0,
    firstName: "Sieger",
    lastName: "Sega"
  }
]);

// Channel-Daten importieren
db.channels.insertMany([
  {
    _id: ObjectId("67c2050825e7897a7235d8d3"),
    name: "Freunde",
    members: [
      ObjectId("67c2047525e7897a7235d8ad"),
      ObjectId("67c204b425e7897a7235d8b8")
    ],
    admin: ObjectId("67c204dd25e7897a7235d8c3"),
    messages: [
      ObjectId("67c2051225e7897a7235d8d6")
    ],
    createdAt: ISODate("2025-02-28T18:45:14.787Z"),
    updatedAt: ISODate("2025-02-28T18:48:50.121Z")
  }
]);

print("Daten erfolgreich importiert!");