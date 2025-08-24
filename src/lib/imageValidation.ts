import { GoogleGenerativeAI } from '@google/generative-ai';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSION = 400;

interface ImageValidationResult {
  isValid: boolean;
  base64: string;
  error?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export type ValidationType = 'plant' | 'animal' | 'skin';

// Get image dimensions from File
function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

// Convert File to Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Main validation function
export async function validateImage(
  file: File,
  type: ValidationType
): Promise<ImageValidationResult> {
  try {
    // 1. File format validation
    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        base64: '',
        error: `Unsupported file format. Please use ${SUPPORTED_FORMATS.map(f => f.split('/')[1]).join(', ')}.`
      };
    }

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        base64: '',
        error: 'File size exceeds 5MB limit.'
      };
    }

    // 3. Image dimensions validation
    const dimensions = await getImageDimensions(file);
    if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
      return {
        isValid: false,
        base64: '',
        error: `Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels.`
      };
    }

    // 4. Convert to base64 for further processing
    const base64 = await fileToBase64(file);

    // 5. Type-specific validation using Gemini API
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this image and tell me if it contains a ${type}. 
                   Only respond with "yes" or "no" followed by a brief explanation.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64.split(',')[1]
        }
      }
    ]);

    const response = result.response.text().toLowerCase();

    if (!response.startsWith('yes')) {
      return {
        isValid: false,
        base64: '',
        error: `This image doesn't appear to contain a ${type}. Please upload an appropriate image.`
      };
    }

    // All validations passed
    return {
      isValid: true,
      base64
    };
  } catch (error) {
    console.error('Image validation error:', error);
    return {
      isValid: false,
      base64: '',
      error: 'Failed to validate image. Please try again.'
    };
  }
}