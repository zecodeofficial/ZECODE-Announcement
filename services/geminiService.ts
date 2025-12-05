import { GoogleGenAI, Modality } from "@google/genai";
import { base64ToUint8Array, pcmToWavBlob } from "../utils/audioUtils";

const API_KEY = process.env.API_KEY || '';

/**
 * Generates speech from text using Gemini 2.5 Flash TTS.
 * It instructs the model to adopt a specific persona.
 */
export const generateSpeech = async (text: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Structured prompt to ensure the model adopts the persona correctly for long text
  // Context: ZECODE Store Announcement
  const personaPrompt = `
Speaker Profile: Professional Indian female staff member at ZECODE store.
Tone: Welcoming, clear, energetic, and polite with a natural Indian accent. Suitable for a public address system.
Context: Making an in-store announcement to customers at ZECODE.
Task: Read the following text aloud exactly as written, conveying a helpful and engaging atmosphere.

Text to read:
${text}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [{ text: personaPrompt }]
        }
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Kore', // Kore provides a clear, balanced female tone suitable for announcements
            },
          },
        },
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API.");
    }

    const audioPart = candidates[0].content?.parts?.find(p => p.inlineData);
    
    if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
       // Sometimes the model might refuse and return text instead
       const textPart = candidates[0].content?.parts?.find(p => p.text);
       if (textPart) {
         throw new Error(`Model returned text instead of audio: ${textPart.text}`);
       }
       throw new Error("No audio data found in response.");
    }

    const base64Data = audioPart.inlineData.data;
    const pcmBytes = base64ToUint8Array(base64Data);
    
    // Convert Raw PCM to WAV for browser compatibility
    const wavBlob = pcmToWavBlob(pcmBytes, 24000);
    
    return URL.createObjectURL(wavBlob);

  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    throw new Error(error.message || "Failed to generate speech.");
  }
};