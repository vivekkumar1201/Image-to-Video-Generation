import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Helper to wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateVideo = async (
  imageBase64: string,
  imageMimeType: string,
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  // Always create a new instance to ensure we capture the latest selected API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Enhance prompt for looping if not explicitly stated, as per app goal
  const enhancedPrompt = prompt.trim() 
    ? `${prompt}. Create a smooth, seamless looping video.` 
    : "Cinematic, realistic motion. Create a smooth, seamless looping video.";

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: enhancedPrompt,
      image: {
        imageBytes: imageBase64,
        mimeType: imageMimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Current Veo fast preview standard
        aspectRatio: aspectRatio,
      }
    });

    // Poll for completion
    while (!operation.done) {
      await delay(5000); // Poll every 5 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log('Polling video generation status...', operation.metadata);
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Video generation failed.");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("No video URI returned from the API.");
    }

    // Append API key to fetch the content protected by the URI
    const authenticatedUrl = `${videoUri}&key=${process.env.API_KEY}`;

    // Fetch the actual blob to create a local URL for the video player
    // This avoids CORS or expiration issues with the direct Google URI in some contexts,
    // and ensures the video plays smoothly.
    const response = await fetch(authenticatedUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Veo generation error:", error);
    throw error;
  }
};

export const checkApiKey = async (): Promise<boolean> => {
  // Cast window to any to avoid type conflict with existing AIStudio definition
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const requestApiKey = async (): Promise<void> => {
  // Cast window to any to avoid type conflict with existing AIStudio definition
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  } else {
    alert("AI Studio environment not detected. Please run this app in the Project IDX or AI Studio environment.");
  }
};
