import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'sonner';
import { SkinAnalysisType } from '@/types/types';
import { parseSkinAnalysis } from './parseSkinAnalysis';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  toast.error('Please add your Gemini API key to the .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

const PROMPT = `
You are a dermatologist. Analyze this facial skin image and provide a detailed analysis in exactly this format:

Overall Skin Type: [combination/oily/dry/normal]

Skin Concerns:
- Acne: [severity and type if present]
- Wrinkles: [presence and severity]
- Pigmentation: [type and severity]
- Pores: [size and visibility]
- Texture: [description]
- Redness: [presence and severity]

Hydration Level: [description of skin's moisture level]

Recommendations:
1. Skincare Routine:
   - Cleanser: [type recommendation]
   - Toner: [if needed]
   - Treatment: [specific products or ingredients]
   - Moisturizer: [type recommendation]
   - Sunscreen: [type and SPF recommendation]

2. Lifestyle Recommendations:
   - Diet: [specific foods that might help]
   - Hydration: [water intake recommendation]
   - Sleep: [if relevant]
   - Stress Management: [if signs of stress-related skin issues]

3. Professional Treatments:
   [list any recommended professional treatments if necessary]

Important Notes:
[any specific warnings or important observations]

Please note: This is an AI-generated analysis and should not replace professional medical advice. Consult a dermatologist for accurate diagnosis and treatment.
`;

export async function analyzeSkin(imageBase64: string): Promise<SkinAnalysisType> {
  if (!API_KEY) {
    toast.error('Gemini API key is not configured. Please check your .env file.');
    throw new Error('Gemini API key is not configured');
  }

  if (!imageBase64) {
    toast.error('No image provided for analysis');
    throw new Error('No image provided for analysis');
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

    console.log('Raw Gemini response:', text);
    const skinAnalysis = parseSkinAnalysis(text);

    if (!skinAnalysis.skinType) {
      toast.error('Could not analyze skin type. Please try a clearer image.');
      throw new Error('Could not analyze skin type');
    }

    return skinAnalysis;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error analyzing skin:', errorMessage);
    toast.error(`Failed to analyze skin: ${errorMessage}`);
    throw error;
  }
}