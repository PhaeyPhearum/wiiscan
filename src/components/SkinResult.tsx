import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SkinResultProps } from '@/types/types';
import { 
  Droplets, 
  AlertTriangle,
  Sparkles,
  Heart,
  Calendar,
  Stethoscope,
  Shield,
  Sun,
  Frown,
  Activity
} from 'lucide-react';

export function SkinResult({ info }: SkinResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 space-y-6"
    >
      {/* Main Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Skin Analysis Results
          </CardTitle>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <p className="text-xl text-primary/80">
              Overall Skin Type: <span className="font-semibold">{info.skinType}</span>
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skin Concerns */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-orange-500" />
              <h3 className="text-2xl font-semibold">Skin Concerns</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(info.concerns).map(([key, value]) => (
                value && (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-secondary rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {key === 'acne' && <Frown className="h-5 w-5 text-red-500" />}
                      {key === 'wrinkles' && <Calendar className="h-5 w-5 text-purple-500" />}
                      {key === 'pigmentation' && <Sun className="h-5 w-5 text-yellow-500" />}
                      {key === 'pores' && <Droplets className="h-5 w-5 text-blue-500" />}
                      {key === 'texture' && <Activity className="h-5 w-5 text-green-500" />}
                      {key === 'redness' && <Heart className="h-5 w-5 text-red-500" />}
                      <p className="text-lg font-medium capitalize">{key}</p>
                    </div>
                    <p className="text-base text-muted-foreground">{value}</p>
                  </motion.div>
                )
              ))}
            </div>
          </div>

          <Separator />

          {/* Hydration Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-blue-500" />
              <h3 className="text-2xl font-semibold">Hydration Level</h3>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-secondary rounded-lg"
            >
              <p className="text-lg text-muted-foreground">{info.hydrationLevel}</p>
            </motion.div>
          </div>

          <Separator />

          {/* Skincare Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <h3 className="text-2xl font-semibold">Recommended Skincare Routine</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(info.recommendations.skincare).map(([key, value], index) => (
                value && (
                  <motion.div
                    key={key}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-secondary rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <p className="text-lg font-medium capitalize mb-1">{key}</p>
                    <p className="text-base text-muted-foreground">{value}</p>
                  </motion.div>
                )
              ))}
            </div>
          </div>

          <Separator />

          {/* Lifestyle Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h3 className="text-2xl font-semibold">Lifestyle Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(info.recommendations.lifestyle).map(([key, value], index) => (
                value && (
                  <motion.div
                    key={key}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-secondary rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <p className="text-lg font-medium capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-base text-muted-foreground">{value}</p>
                  </motion.div>
                )
              ))}
            </div>
          </div>

          {/* Professional Treatments */}
          {info.recommendations.professionalTreatments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-6 w-6 text-green-500" />
                  <h3 className="text-2xl font-semibold">Professional Treatments</h3>
                </div>
                <div className="space-y-2">
                  {info.recommendations.professionalTreatments.map((treatment, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-secondary rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <p className="text-lg text-muted-foreground">{treatment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Important Notes */}
          {info.importantNotes && (
            <>
              <Separator />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-2xl font-semibold">Important Notes</h3>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-lg text-muted-foreground">{info.importantNotes}</p>
                </div>
              </motion.div>
            </>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-secondary rounded-lg border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-lg font-medium">Medical Disclaimer</p>
            </div>
            <p className="text-base text-muted-foreground italic">
              This analysis is generated by AI and should not replace professional medical advice. 
              Please consult a dermatologist for accurate diagnosis and treatment.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}