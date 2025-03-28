/*  
    Veränderungsdatum: 23.03.2025  
    Diese Datei enthält Hilfsfunktionen und Konfigurationen für die Verwendung von Tailwind CSS und Lottie-Animationen.  
    Sie umfasst Funktionen zum Zusammenführen von Tailwind-Klassen, das Abrufen von Farben und Standardoptionen für Lottie-Animationen.  
*/

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"

// Funktion zum Kombinieren von Tailwind Klassen und Auflösen von Konflikten
export function cn(...inputs) {
  return twMerge(clsx(inputs)); // clsx & tailwind-merge, um Eingabewerte zu kombinieren
}

// Styles
export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ddd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
  "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9fa] border-[1px] border-[#4cc9f0bb]",
];

// Farbkombination basierend auf Index
export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to first colour
};

// Lottie Animation, Animation loop, Autostart, Lottie Data
export const animationDefaultOptions = {
  loop: true,
  autplay: true,
  animationData,
}