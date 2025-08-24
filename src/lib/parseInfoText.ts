import { PlantInfoType } from '@/types/types';
import { toast } from 'sonner';

export function parsePlantInfo(text: string): PlantInfoType {
  const info: PlantInfoType = {
    name: '',
    scientificName: '',
    description: '',
    careInstructions: {}
  };

  if (!text) {
    toast.error('No text provided to parse');
    return info;
  }

  try {
    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = '';
    let currentKey = '';

    for (const line of lines) {
      const trimmedLine = line.trim().toLowerCase();
      const originalLine = line.trim();
      
      // Handle main sections
      if (trimmedLine.startsWith('common name:')) {
        info.name = originalLine.split(':')[1]?.trim() || '';
        continue;
      }
      
      if (trimmedLine.startsWith('scientific name:')) {
        info.scientificName = originalLine.split(':')[1]?.trim() || '';
        continue;
      }
      
      if (trimmedLine.startsWith('description:')) {
        currentSection = 'description';
        info.description = originalLine.split(':')[1]?.trim() || '';
        continue;
      }
      
      if (trimmedLine === 'care instructions:') {
        currentSection = 'care';
        continue;
      }

      // Handle content based on current section
      if (currentSection === 'description' && !trimmedLine.includes(':')) {
        info.description = info.description
          ? `${info.description} ${originalLine}`
          : originalLine;
      }
      
      if (currentSection === 'care') {
        if (trimmedLine.includes(':')) {
          const [key, value] = originalLine.split(':').map(s => s.trim());
          if (key && value) {
            info.careInstructions[key] = value;
            currentKey = key;
          }
        } else if (currentKey) {
          // Append to previous care instruction if it's a continuation
          info.careInstructions[currentKey] += ` ${originalLine}`;
        }
      }
    }

    // Clean up and validate
    info.description = info.description.trim();
    
    Object.keys(info.careInstructions).forEach(key => {
      info.careInstructions[key] = info.careInstructions[key].trim();
    });

    return info;
  } catch (error) {
    console.error('Error parsing plant info:', error);
    toast.error('Failed to parse plant information');
    return info;
  }
}