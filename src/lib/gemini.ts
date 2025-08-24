import { GoogleGenerativeAI } from '@google/generative-ai';
import { PlantInfoType } from '@/types/types';
import { parsePlantInfo } from './parseInfoText';
import { toast } from 'sonner';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  toast.error('Please add your Gemini API key to the .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

const PROMPT = `
You are a botanical expert. Analyze this plant image and provide detailed information in exactly this format:

Common Name: [plant's common name]
Scientific Name: [scientific name]
Description: [2-3 sentences describing the plant's appearance and characteristics]
Care Instructions:
Light: [light requirements]
Water: [watering needs]
Soil: [soil preferences]
Temperature: [temperature requirements]
Humidity: [humidity preferences]
Fertilizer: [fertilizing recommendations]

Important: Always provide the Common Name and Scientific Name. If you're not completely certain, use qualifiers like "appears to be" or "likely". Never skip these fields.
`;

export async function identifyPlant(imageBase64: string): Promise<PlantInfoType> {
  if (!API_KEY) {
    toast.error('Gemini API key is not configured. Please check your .env file.');
    throw new Error('Gemini API key is not configured');
  }

  if (!imageBase64) {
    toast.error('No image provided for identification');
    throw new Error('No image provided for identification');
  }

  try {
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    if (!result || !result.response) {
      toast.error('Failed to get a response from Gemini API');
      throw new Error('No response from Gemini API');
    }

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      toast.error('Received empty response from Gemini API');
      throw new Error('Empty response from Gemini API');
    }

    const plantInfo = parsePlantInfo(text);

    // Validate the essential fields
    if (!plantInfo.name && !plantInfo.scientificName) {
      toast.error('The AI could not identify this plant with confidence. Please try a clearer image.');
      throw new Error('Could not identify plant with confidence');
    }

    return plantInfo;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error identifying plant:', errorMessage);
    toast.error(`Failed to identify plant: ${errorMessage}`);
    throw error;
  }
}