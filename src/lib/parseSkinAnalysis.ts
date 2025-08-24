import { SkinAnalysisType } from '@/types/types';
import { toast } from 'sonner';

export function parseSkinAnalysis(text: string): SkinAnalysisType {
  const info: SkinAnalysisType = {
    skinType: '',
    concerns: {
      acne: '',
      wrinkles: '',
      pigmentation: '',
      pores: '',
      texture: '',
      redness: ''
    },
    hydrationLevel: '',
    recommendations: {
      skincare: {
        cleanser: '',
        toner: '',
        treatment: '',
        moisturizer: '',
        sunscreen: ''
      },
      lifestyle: {
        diet: '',
        hydration: '',
        sleep: '',
        stressManagement: ''
      },
      professionalTreatments: []
    },
    importantNotes: ''
  };

  if (!text) {
    throw new Error('No text provided to parse');
  }

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    let currentSection = '';

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      // Handle main sections
      if (lowerLine.startsWith('overall skin type:')) {
        info.skinType = line.split(':')[1]?.trim() || '';
        currentSection = '';
      } else if (lowerLine === 'skin concerns:') {
        currentSection = 'concerns';
      } else if (lowerLine.startsWith('hydration level:')) {
        info.hydrationLevel = line.split(':')[1]?.trim() || '';
        currentSection = '';
      } else if (lowerLine === 'recommendations:') {
        currentSection = 'recommendations';
      } else if (lowerLine.startsWith('1. skincare routine:')) {
        currentSection = 'skincare';
      } else if (lowerLine.startsWith('2. lifestyle recommendations:')) {
        currentSection = 'lifestyle';
      } else if (lowerLine.startsWith('3. professional treatments:')) {
        currentSection = 'professionalTreatments';
      } else if (lowerLine.startsWith('important notes:')) {
        currentSection = 'notes';
        info.importantNotes = line.split(':')[1]?.trim() || '';
      } else {
        // Handle content based on current section
        switch (currentSection) {
          case 'concerns':
            if (line.startsWith('-')) {
              const [concern, value] = line.substring(1).split(':').map(s => s.trim());
              const concernKey = concern.toLowerCase() as keyof typeof info.concerns;
              if (concernKey in info.concerns) {
                info.concerns[concernKey] = value;
              }
            }
            break;

          case 'skincare':
            if (line.startsWith('-')) {
              const [item, value] = line.substring(1).split(':').map(s => s.trim());
              const itemKey = item.toLowerCase() as keyof typeof info.recommendations.skincare;
              if (itemKey in info.recommendations.skincare) {
                info.recommendations.skincare[itemKey] = value;
              }
            }
            break;

          case 'lifestyle':
            if (line.startsWith('-')) {
              const [item, value] = line.substring(1).split(':').map(s => s.trim());
              const itemKey = item.toLowerCase().replace(/\s+/g, '') as keyof typeof info.recommendations.lifestyle;
              if (itemKey in info.recommendations.lifestyle) {
                info.recommendations.lifestyle[itemKey] = value;
              }
            }
            break;

          case 'professionalTreatments':
            if (line.startsWith('-')) {
              info.recommendations.professionalTreatments.push(line.substring(1).trim());
            }
            break;

          case 'notes':
            info.importantNotes += ' ' + line;
            break;
        }
      }
    }

    // Clean up all text fields
    info.importantNotes = info.importantNotes.trim();

    return info;
  } catch (error) {
    console.error('Error parsing skin analysis:', error);
    toast.error('Failed to parse skin analysis');
    throw error;
  }
}