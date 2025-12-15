import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScoutReport = async (
  playerName: string,
  skill: number,
  manner: number,
  matches: number
): Promise<string> => {
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