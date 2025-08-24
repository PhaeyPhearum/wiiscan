import { AnimalInfoType } from '@/types/types';
import { toast } from 'sonner';

export function parseAnimalInfo(text: string): AnimalInfoType {
  const info: AnimalInfoType = {
    name: '',
    scientificName: '',
    classification: {
      kingdom: '',
      class: '',
      order: '',
      family: ''
    },
    description: '',
    habitat: '',
    diet: '',
    behavior: '',
    conservationStatus: ''
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
      if (lowerLine.startsWith('common name:')) {
        info.name = line.split(':')[1]?.trim() || '';
      } else if (lowerLine.startsWith('scientific name:')) {
        info.scientificName = line.split(':')[1]?.trim() || '';
      } else if (lowerLine.startsWith('description:')) {
        info.description = line.split(':')[1]?.trim() || '';
        currentSection = 'description';
      } else if (lowerLine.startsWith('habitat:')) {
        info.habitat = line.split(':')[1]?.trim() || '';
        currentSection = 'habitat';
      } else if (lowerLine.startsWith('diet:')) {
        info.diet = line.split(':')[1]?.trim() || '';
        currentSection = 'diet';
      } else if (lowerLine.startsWith('behavior:')) {
        info.behavior = line.split(':')[1]?.trim() || '';
        currentSection = 'behavior';
      } else if (lowerLine.includes('conservation status:')) {
        info.conservationStatus = line.split(':')[1]?.trim() || '';
        currentSection = 'conservation';
      } else if (lowerLine === 'classification:') {
        currentSection = 'classification';
      } else {
        // Handle classification entries
        if (currentSection === 'classification') {
          const parts = line.split(':').map(part => part.trim());
          if (parts.length === 2) {
            const [key, value] = parts;
            const cleanKey = key.toLowerCase().replace(/[^a-z]/g, '');
            if (['kingdom', 'class', 'order', 'family', 'phylum', 'genus'].includes(cleanKey)) {
              info.classification[cleanKey as keyof typeof info.classification] = value;
            }
          }
        } else {
          // Append content to current section if it's a continuation
          switch (currentSection) {
            case 'description':
              info.description += ' ' + line;
              break;
            case 'habitat':
              info.habitat += ' ' + line;
              break;
            case 'diet':
              info.diet += ' ' + line;
              break;
            case 'behavior':
              info.behavior += ' ' + line;
              break;
            case 'conservation':
              info.conservationStatus += ' ' + line;
              break;
          }
        }
      }
    }

    // Clean up all text fields
    Object.keys(info).forEach(key => {
      if (typeof info[key as keyof AnimalInfoType] === 'string') {
        (info[key as keyof AnimalInfoType] as string) = (info[key as keyof AnimalInfoType] as string).trim();
      }
    });

    // Validate essential fields
    if (!info.name && !info.scientificName) {
      throw new Error('Could not identify animal name or scientific name');
    }

    return info;
  } catch (error) {
    console.error('Error parsing animal info:', error);
    toast.error('Failed to parse animal information');
    throw error;
  }
}