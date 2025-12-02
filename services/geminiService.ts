import { GoogleGenAI } from "@google/genai";

// Ensure API Key is present
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates an icon based on the user prompt using Gemini 2.5 Flash Image model.
 */
export const generateIconFromPrompt = async (prompt: string): Promise<string> => {
  try {
    // Enhance prompt to ensure icon-specific style
    const enhancedPrompt = `
      Design a professional mobile application icon for: ${prompt}. 
      Style: Minimalist, modern vector art, vibrant colors, solid or subtle gradient background. 
      High contrast, suitable for iOS and Android app stores. 
      Do not include text or gloss effects unless specified.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: enhancedPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the model.");
    }

    const content = response.candidates[0].content;
    
    // Iterate parts to find the image
    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Model generated a response but no image data was found.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate icon.");
  }
};
