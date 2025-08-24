export interface PlantInfoType {
  name: string;
  scientificName: string;
  description: string;
  careInstructions: {
    [key: string]: string;
  };
}

export interface AnimalInfoType {
  name: string;
  scientificName: string;
  classification: {
    kingdom: string;
    phylum?: string;
    class: string;
    order: string;
    family: string;
    genus?: string;
    [key: string]: string | undefined;
  };
  description: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservationStatus: string;
}

export interface SkinAnalysisType {
  skinType: string;
  concerns: {
    acne: string;
    wrinkles: string;
    pigmentation: string;
    pores: string;
    texture: string;
    redness: string;
  };
  hydrationLevel: string;
  recommendations: {
    skincare: {
      cleanser: string;
      toner: string;
      treatment: string;
      moisturizer: string;
      sunscreen: string;
    };
    lifestyle: {
      diet: string;
      hydration: string;
      sleep: string;
      stressManagement: string;
    };
    professionalTreatments: string[];
  };
  importantNotes: string;
}

export interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  isProcessing: boolean;
  onProgress?: (progress: number) => void;
  type?: 'plant' | 'animal' | 'skin';
}

export interface PlantResultProps {
  info: PlantInfoType;
}

export interface AnimalResultProps {
  info: AnimalInfoType;
}

export interface SkinResultProps {
  info: SkinAnalysisType;
}