
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiResponse = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "Du bist der intelligente Assistent für 'Allround Service Stielke'. Deine Firma bietet Dienstleistungen wie Gartenpflege, Hausmeister-Service, Reparaturen und Reinigungen an. Firmenstandort: Naundorfer Weg 4, 06198 Salzatal. Telefon: 015123556495. E-Mail: kontakt@allroundservicestielke.de. Sei freundlich, professionell und hilfsbereit. Antworte immer auf Deutsch.",
        temperature: 0.7,
      },
    });
    return response.text || "Entschuldigung, ich konnte keine Antwort generieren.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Es gab ein Problem bei der Verbindung zum Assistenten.";
  }
};
