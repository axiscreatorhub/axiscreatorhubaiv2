import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Check, Play } from 'lucide-react';

export interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface TutorialOverlayProps {
  moduleName: string;
  steps: TutorialStep[];
  onComplete: () => void;
}

export default function TutorialOverlay({ moduleName, steps, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const stepData = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
        >
          {/* Progress Bar */}
          <div className="h-1 bg-zinc-800 w-full">
            <motion.div 
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <button 
            onClick={onComplete}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
              <span className="font-bold text-white text-xl">{currentStep + 1}</span>
            </div>

            <h2 className="text-2xl font-bold mb-3">{stepData.title}</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {stepData.description}
            </p>

            {stepData.image && (
              <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center relative group">
                 {/* Placeholder for demo visual */}
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                 <Play className="text-white/50 group-hover:text-white transition-colors" size={32} />
                 <span className="absolute bottom-2 text-xs text-gray-500">Demo Preview</span>
              </div>
            )}

            <div className="flex gap-3">
              {stepData.actionLabel && (
                <button
                  onClick={() => {
                    stepData.onAction?.();
                    handleNext();
                  }}
                  className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                >
                  {stepData.actionLabel}
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep === steps.length - 1 ? <Check size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 text-center text-xs text-gray-500 border-t border-white/5">
            {moduleName} Tutorial • Step {currentStep + 1} of {steps.length}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
