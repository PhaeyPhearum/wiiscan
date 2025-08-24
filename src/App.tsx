import React, { useState, useCallback, useRef } from 'react';
import { Leaf, PawPrint, Scan, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { ImageUpload } from '@/components/ImageUpload';
import { PlantResult } from '@/components/PlantResult';
import { AnimalResult } from '@/components/AnimalResult';
import { SkinResult } from '@/components/SkinResult';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Navbar } from '@/components/Navbar';
import { identifyPlant } from '@/lib/gemini';
import { identifyAnimal } from '@/lib/gemini-animal';
import { analyzeSkin } from '@/lib/gemini-skin';
import { toast } from 'sonner';
import { PlantInfoType, AnimalInfoType, SkinAnalysisType } from '@/types/types';
import { Button } from '@/components/ui/button';
import './App.css';

const DEFAULT_IMAGES = {
  plant: '/images/default-plant.jpg',
  animal: '/images/default-animal.jpg',
  skin: '/images/default-skin.jpg'
} as const;

type DefaultImageType = typeof DEFAULT_IMAGES[keyof typeof DEFAULT_IMAGES];

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [plantInfo, setPlantInfo] = useState<PlantInfoType | null>(null);
  const [animalInfo, setAnimalInfo] = useState<AnimalInfoType | null>(null);
  const [skinInfo, setSkinInfo] = useState<SkinAnalysisType | null>(null);
  const [mode, setMode] = useState<'plant' | 'animal' | 'skin'>('skin');
  const [previewImage, setPreviewImage] = useState<DefaultImageType | string>(DEFAULT_IMAGES.skin);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  const scrollToResult = () => {
    if (resultSectionRef.current) {
      const yOffset = -100; // Offset to account for the fixed header
      const element = resultSectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleImageSelect = useCallback(async (base64: string) => {
    if (!base64) {
      toast.error('Please select a valid image');
      return;
    }

    setIsProcessing(true);
    setPlantInfo(null);
    setAnimalInfo(null);
    setSkinInfo(null);
    setPreviewImage(base64);
    
    try {
      switch (mode) {
        case 'plant':
          const plantResult = await identifyPlant(base64);
          if (plantResult && (plantResult.name || plantResult.scientificName)) {
            setPlantInfo(plantResult);
            toast.success(`Identified plant: ${plantResult.name || plantResult.scientificName}`);
            // Scroll to results after a brief delay
            setTimeout(scrollToResult, 500);
          } else {
            toast.error('Could not identify the plant. Please try a different image.');
            setPreviewImage(DEFAULT_IMAGES.plant);
          }
          break;

        case 'animal':
          const animalResult = await identifyAnimal(base64);
          if (animalResult && (animalResult.name || animalResult.scientificName)) {
            setAnimalInfo(animalResult);
            toast.success(`Identified animal: ${animalResult.name || animalResult.scientificName}`);
            // Scroll to results after a brief delay
            setTimeout(scrollToResult, 500);
          } else {
            toast.error('Could not identify the animal. Please try a different image.');
            setPreviewImage(DEFAULT_IMAGES.animal);
          }
          break;

        case 'skin':
          const skinResult = await analyzeSkin(base64);
          if (skinResult && skinResult.skinType) {
            setSkinInfo(skinResult);
            toast.success('Skin analysis completed successfully');
            // Scroll to results after a brief delay
            setTimeout(scrollToResult, 500);
          } else {
            toast.error('Could not analyze skin. Please try a clearer facial image.');
            setPreviewImage(DEFAULT_IMAGES.skin);
          }
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to process image: ${errorMessage}`);
      console.error(`Error processing ${mode}:`, error);
      setPreviewImage(DEFAULT_IMAGES[mode]);
    } finally {
      setIsProcessing(false);
    }
  }, [mode]);

  const handleModeChange = useCallback((newMode: 'plant' | 'animal' | 'skin') => {
    setMode(newMode);
    setPlantInfo(null);
    setAnimalInfo(null);
    setSkinInfo(null);
    setPreviewImage(DEFAULT_IMAGES[newMode]);
  }, []);

  const scrollToUploadSection = () => {
    if (uploadSectionRef.current) {
      const yOffset = -100; // Offset to account for the fixed header
      const element = uploadSectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Add scroll event listener to show/hide back to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIcon = (currentMode: typeof mode) => {
    switch (currentMode) {
      case 'plant':
        return <Leaf className="h-8 w-8 text-primary animate-float" />;
      case 'animal':
        return <PawPrint className="h-8 w-8 text-primary animate-float" />;
      case 'skin':
        return <Scan className="h-8 w-8 text-primary animate-float" />;
    }
  };

  const getDescription = (currentMode: typeof mode) => {
    switch (currentMode) {
      case 'plant':
        return "Discover the secrets of nature! Upload a photo or take a picture of any plant, and our AI will identify it and provide valuable information.";
      case 'animal':
        return "Explore the animal kingdom! Upload a photo or take a picture of any animal, and our AI will identify it and provide detailed information.";
      case 'skin':
        return "Get personalized skin analysis! Upload a clear photo of your face, and our AI will analyze your skin type, concerns, and provide tailored recommendations.";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onModeChange={handleModeChange} currentMode={mode} />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div 
              className="flex items-center justify-center gap-2 mb-4"
              initial={false}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-9 pt-9 flex items-center gap-2"
                >
                  {getIcon(mode)}
                  <h1 className="text-3xl font-bold">
                    {mode === 'skin' ? 'Skin Analysis' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Identifier`}
                  </h1>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getDescription(mode)}
            </motion.p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {(['skin', 'plant', 'animal'] as const).map((type) => (
              <motion.button
                key={type}
                type="button"
                onClick={() => handleModeChange(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type === 'plant' && <Leaf className="inline-block w-4 h-4 mr-2" />}
                {type === 'animal' && <PawPrint className="inline-block w-4 h-4 mr-2" />}
                {type === 'skin' && <Scan className="inline-block w-4 h-4 mr-2" />}
                <span className="font-bold whitespace-nowrap">
                  {type.charAt(0).toUpperCase() + type.slice(1)} {type === 'skin' ? 'Analysis' : 'ID'}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Image Preview and Upload Section */}
          <div ref={uploadSectionRef} className="grid md:grid-cols-2 gap-8 items-start">
            {/* Preview Image */}
              <motion.div 
                className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg hover-card"
                layoutId="preview-container"
              >
                <motion.div className="relative w-full pb-[100%]">
                  <motion.img
                    src={previewImage}
                    alt={`${mode} preview`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                {isProcessing && (
                  <motion.div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <LoadingAnimation type={mode} />
                  </motion.div>
                )}
              </motion.div>

            {/* Upload Section */}
            <ImageUpload
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
              type={mode}
            />
          </div>

          {/* Results Section */}
          <div ref={resultSectionRef}>
            <AnimatePresence mode="wait">
              {plantInfo && mode === 'plant' && <PlantResult info={plantInfo} />}
              {animalInfo && mode === 'animal' && <AnimalResult info={animalInfo} />}
              {skinInfo && mode === 'skin' && <SkinResult info={skinInfo} />}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToUploadSection}
              size="lg"
              className="rounded-full p-4 bg-primary hover:bg-primary/90"
            >
              <ArrowUp className="h-6 w-6" />
              <span className="sr-only">Back to upload section</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;