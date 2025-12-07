import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to strip the data:image/xyz;base64, prefix
const extractBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

const extractMimeType = (dataUrl: string): string => {
  return dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
}

export const generateImageEdit = async (
  sourceImageDataUrl: string,
  prompt: string
): Promise<string> => {
  try {
    const base64Data = extractBase64(sourceImageDataUrl);
    const mimeType = extractMimeType(sourceImageDataUrl);

    // Using 'gemini-2.5-flash-image' (mapped from "nano banana" requirement)
    // It supports image editing via prompt + image input
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        // No specific imageConfig for resolution needed for flash-image unless strictly required
        // Aspect ratio defaults to 1:1, can be changed if needed, but flash-image is flexible
      }
    });

    // Parse response for image
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
