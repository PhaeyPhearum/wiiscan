import { motion } from 'framer-motion';
import { Leaf, Sparkles, Scan } from 'lucide-react';
import React from 'react';

interface LoadingAnimationProps {
  type: 'plant' | 'animal' | 'skin';
}

export const LoadingAnimation = React.memo(function LoadingAnimation({ type }: LoadingAnimationProps) {
  const Icon = type === 'plant' ? Leaf : type === 'animal' ? Sparkles : Scan;

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute"
      >
        <Icon className="w-12 h-12 text-primary/50" />
      </motion.div>
      <motion.div
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Icon className="w-12 h-12 text-primary" />
      </motion.div>
    </div>
  );
});