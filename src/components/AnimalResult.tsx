import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AnimalResultProps } from '@/types/types';
import { AlertTriangle } from 'lucide-react';

export function AnimalResult({ info }: AnimalResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 space-y-6"
    >
      {/* Main Identification Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary">
            {info.name || 'Animal Information'}
          </CardTitle>
          {info.scientificName && (
            <p className="text-xl text-primary/80 italic">
              {info.scientificName}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Taxonomy Classification */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Taxonomy Classification</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(info.classification).map(([key, value]) => (
                <div key={key} className="p-4 bg-secondary rounded-lg">
                  <p className="text-lg font-medium capitalize mb-1">{key}</p>
                  <p className="text-base text-muted-foreground">{value || 'Unknown'}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Description */}
          {info.description && (
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Description</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {info.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Habitat & Geographic Range */}
          {info.habitat && (
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Habitat & Geographic Range</h3>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {info.habitat}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Behavior & Diet */}
          <div className="grid md:grid-cols-2 gap-6">
            {info.behavior && (
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Behavior</h3>
                <div className="p-4 bg-secondary rounded-lg h-full">
                  <p className="text-lg text-muted-foreground">
                    {info.behavior}
                  </p>
                </div>
              </div>
            )}
            
            {info.diet && (
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Diet</h3>
                <div className="p-4 bg-secondary rounded-lg h-full">
                  <p className="text-lg text-muted-foreground">
                    {info.diet}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Conservation Status */}
          {info.conservationStatus && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold">Conservation Status</h3>
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div className={`p-4 rounded-lg ${
                  info.conservationStatus.toLowerCase().includes('endangered') 
                    ? 'bg-red-100 dark:bg-red-900/20' 
                    : 'bg-secondary'
                }`}>
                  <p className="text-lg text-muted-foreground">
                    {info.conservationStatus}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}