import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Table from './Table';
import { PlantResultProps } from '@/types/types';

export function PlantResult({ info }: PlantResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary">
            {info.name || 'Plant Information'}
          </CardTitle>
          {info.scientificName && (
            <p className="text-xl text-primary/80 italic">
              {info.scientificName}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {info.description && (
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Description</h3>
              <p className="text-lg text-muted-foreground">{info.description}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Details</h3>
            <Table info={info} />
          </div>

          {info.careInstructions && typeof info.careInstructions === 'object' && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Care Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(info.careInstructions).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-lg bg-secondary">
                      <h4 className="text-lg font-medium capitalize mb-2">{key}</h4>
                      <p className="text-base text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}