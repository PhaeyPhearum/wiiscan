import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageUploadProps } from '@/types/types';
import { validateImage } from '@/lib/imageValidation';

export function ImageUpload({ 
  onImageSelect, 
  isProcessing, 
  onProgress,
  type = 'plant'
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const simulateProgress = useCallback(() => {
    setShowProgress(true);
    setUploadProgress(0);
    let progress = 0;
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) {
        clearInterval(progressIntervalRef.current);
        progress = 90;
      }
      setUploadProgress(Math.min(Math.round(progress), 90));
      onProgress?.(Math.min(Math.round(progress), 90));
    }, 200);
  }, [onProgress]);

  const processFile = useCallback(async (file?: File) => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    try {
      simulateProgress();

      const validationResult = await validateImage(file, type);
      
      if (!validationResult.isValid) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        setUploadProgress(0);
        setShowProgress(false);
        onProgress?.(0);
        toast.error(validationResult.error || 'Invalid image');
        return;
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Complete the progress animation
      setUploadProgress(100);
      onProgress?.(100);
      
      // Pass the image data to parent
      onImageSelect(validationResult.base64);
      
      // Hide progress after a brief delay
      setTimeout(() => {
        setShowProgress(false);
        setUploadProgress(0);
        onProgress?.(0);
      }, 800);
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setUploadProgress(0);
      setShowProgress(false);
      onProgress?.(0);
      toast.error('Failed to process image');
    }
  }, [type, onImageSelect, onProgress, simulateProgress]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFile(e.dataTransfer.files?.[0]);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  }, [processFile]);

  React.useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto md:aspect-square"
    >
      <motion.div
        className={`upload-zone relative min-h-[350px] md:h-full border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 flex flex-col justify-center ${
          dragActive ? 'border-primary bg-secondary/50' : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <motion.div 
            className="flex justify-center"
            animate={{ 
              scale: isProcessing ? [1, 1.2, 1] : dragActive ? 1.2 : 1,
              rotate: dragActive ? 180 : 0
            }}
            transition={{
              scale: {
                repeat: isProcessing ? Infinity : 0,
                duration: 1.5
              }
            }}
          >
            <Upload className="h-12 w-12 text-primary" />
          </motion.div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drag and drop your image here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, WEBP (max 5MB)
            </p>
            <p className="text-xs text-muted-foreground">
              Minimum size: 400x400px
            </p>
          </div>
          
          <AnimatePresence>
            {showProgress && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                        {uploadProgress < 100 ? 'Processing' : 'Complete'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-primary/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </motion.div>
            
            {navigator.mediaDevices && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  disabled={isProcessing}
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}