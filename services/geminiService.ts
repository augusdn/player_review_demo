import { GoogleGenAI } from "@google/genai";

// For GitHub Pages deployment, we'll make API key optional
// Users can provide their own key via environment variable or it will gracefully fail
const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateScoutReport = async (
  playerName: string,
  skill: number,
  manner: number,
  matches: number
): Promise<string> => {
  // If no API key is configured, return a friendly message
  if (!ai) {
    return `⚽ Scout Report for ${playerName}: With ${skill.toFixed(1)}/5.0 skill and ${manner.toFixed(1)}/5.0 sportsmanship over ${matches} matches, this player shows great potential! (AI reports require a Gemini API key)`;
  }

  try {
    const prompt = `
      You are a professional futsal scout. Write a short, energetic, and engaging 2-sentence scout report for a player named ${playerName}.
      
      Here are their stats (out of 5):
      - Skill Level: ${skill.toFixed(1)}/5.0
      - Sportsmanship/Manner: ${manner.toFixed(1)}/5.0
      - Experience: ${matches} matches played.

      If skill is high and manner is low, warn them about attitude.
      If manner is high and skill is low, praise their teamwork but suggest practice.
      If both are high, call them a "World Class Prospect".
      If both are low, encourage them to keep trying.
      
      Keep it fun and sporty.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Scout report currently unavailable.";
  } catch (error) {
    console.error("Failed to generate scout report:", error);
    return "Our scouts are currently busy watching another match. Check back later!";
  }
};