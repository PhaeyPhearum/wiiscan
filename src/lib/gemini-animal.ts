import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'sonner';
import { AnimalInfoType } from '@/types/types';
import { parseAnimalInfo } from './parseAnimalInfo';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  toast.error('Please add your Gemini API key to the .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

const PROMPT = `
You are a zoologist. Analyze this animal image and provide detailed information in exactly this format:

Common Name: [animal's common name]
Scientific Name: [scientific name]
Classification:
  Kingdom: [kingdom]
  Class: [class]
  Order: [order]
  Family: [family]
Description: [2-3 sentences describing the animal's appearance and characteristics]
Habitat: [natural habitat and geographical distribution]
Diet: [feeding habits and preferred food]
Behavior: [notable behavioral characteristics]
Conservation Status: [IUCN Red List status if applicable]

Important: Always provide the Common Name and Scientific Name. If you're not completely certain, use qualifiers like "appears to be" or "likely". Never skip these fields.
`;

export async function identifyAnimal(imageBase64: string): Promise<AnimalInfoType> {
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

    // Log the raw response for debugging
    console.log('Raw Gemini response:', text);

    const animalInfo = parseAnimalInfo(text);

    // Validate the essential fields
    if (!animalInfo.name && !animalInfo.scientificName) {
      toast.error('The AI could not identify this animal with confidence. Please try a clearer image.');
      throw new Error('Could not identify animal with confidence');
    }

    return animalInfo;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error identifying animal:', errorMessage);
    toast.error(`Failed to identify animal: ${errorMessage}`);
    throw error;
  }
}