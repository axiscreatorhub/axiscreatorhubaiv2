import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Layers, 
  Youtube, 
  Smartphone, 
  ArrowLeft, 
  Sparkles, 
  Wand2,
  Play,
  Check,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';
import TutorialOverlay from '../../components/ui/TutorialOverlay';
import { useTutorial } from '../../hooks/useTutorial';
import { TUTORIALS } from '../../lib/tutorialData';

type Format = {
  id: string;
  label: string;
  icon: any;
  description: string;
  color: string;
  endpoint: string; // Mapping to backend
};

const FORMATS: Format[] = [
  { id: 'tiktok', label: 'TikTok Video', icon: Smartphone, description: 'Viral short-form video scripts', color: 'from-[#3B82F6] to-[#8B5CF6]', endpoint: '/hooks/generate' },
  { id: 'reel', label: 'Instagram Reel', icon: Video, description: 'Trending audio & visual concepts', color: 'from-[#8B5CF6] to-[#EC4899]', endpoint: '/hooks/generate' },
  { id: 'short', label: 'YouTube Short', icon: Youtube, description: 'High-retention short scripts', color: 'from-[#EC4899] to-[#3B82F6]', endpoint: '/hooks/generate' },
  { id: 'image', label: 'AI Image', icon: ImageIcon, description: 'Thumbnails & post visuals', color: 'from-[#3B82F6] via-[#8B5CF6] to-[#EC4899]', endpoint: '/assets/generate' },
  { id: 'carousel', label: 'Carousel', icon: Layers, description: 'Multi-slide educational posts', color: 'from-[#8B5CF6] to-[#3B82F6]', endpoint: '/hooks/generate' },
  { id: 'script', label: 'Long Script', icon: FileText, description: 'Full length video scripts', color: 'from-[#EC4899] to-[#8B5CF6]', endpoint: '/hooks/generate' },
];

const STYLES = [
  { id: 'minimal', label: 'Minimalist', preview: 'bg-[#0A0E1A]' },
  { id: 'bold', label: 'Bold & Loud', preview: 'bg-[#EC4899]' },
  { id: 'professional', label: 'Professional', preview: 'bg-[#3B82F6]' },
  { id: 'cinematic', label: 'Cinematic', preview: 'bg-[#8B5CF6]' },
];

const SAMPLE_PROMPTS = [
  "A day in the life of a software engineer",
  "5 tips to save money on groceries",
  "Why AI will change everything in 2025",
  "Fitness routine for busy professionals"
];

export default function CreatePage() {
  const { getToken } = useAppAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Tutorial Hook
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial('create');

  const handleFormatSelect = (format: Format) => {
    setSelectedFormat(format);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!prompt || !selectedFormat) return;
    
    setLoading(true);
    setStep(3);

    try {
      // Determine payload based on format
      let body: any = {};
      let endpoint = selectedFormat.endpoint;

      if (selectedFormat.id === 'image') {
        body = { type: 'THUMBNAIL', prompt: `${selectedStyle.label} style: ${prompt}` };
      } else {
        // For video/scripts, we use the hooks endpoint for now to generate the text content
        // In a real app, this might call a video gen endpoint
        body = { 
          topic: prompt, 
          tone: selectedStyle.label, 
          format: selectedFormat.label 
        };
      }

      const res = await apiClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      }, getToken);

      setResult(res);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setPrompt('');
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[80vh]">
      {showTutorial && (
        <TutorialOverlay 
          moduleName="Create Studio" 
          steps={TUTORIALS.create} 
          onComplete={completeTutorial} 
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Create New Content
          </h1>
          <p className="text-gray-400">Turn your ideas into reality with AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetTutorial}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title="Replay Tutorial"
          >
            <HelpCircle size={20} />
          </button>
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1 as any)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: CHOOSE FORMAT */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {FORMATS.map((format, i) => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format)}
                className="group relative p-6 bg-zinc-900 border border-white/10 rounded-2xl hover:border-white/20 transition-all text-left overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${format.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${format.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <format.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1">{format.label}</h3>
                <p className="text-sm text-gray-400">{format.description}</p>
              </button>
            ))}
          </motion.div>
        )}

        {/* STEP 2: CONFIGURE */}
        {step === 2 && selectedFormat && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedFormat.color} flex items-center justify-center`}>
                  <selectedFormat.icon size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold">New {selectedFormat.label}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What is this content about?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. 3 ways to stay productive working from home..."
                    className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#8B5CF6] outline-none resize-none"
                  />
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {SAMPLE_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(p)}
                        className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose a Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          selectedStyle.id === style.id
                            ? 'bg-white/10 border-[#8B5CF6]'
                            : 'bg-black border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className={`w-full h-8 rounded-lg mb-2 ${style.preview}`} />
                        <span className="text-sm font-medium block">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!prompt}
                  className="w-full py-4 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Wand2 size={20} />
                  Generate Magic
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: LOADING */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#8B5CF6] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-[#8B5CF6] animate-pulse" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Crafting your content...</h2>
            <p className="text-gray-400">AI is analyzing trends and writing your script.</p>
          </motion.div>
        )}

        {/* STEP 4: RESULT */}
        {step === 4 && result && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <Check size={16} />
                  </div>
                  <span className="font-bold">Generation Complete</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={reset} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
                    Create Another
                  </button>
                  <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200">
                    Export / Save
                  </button>
                </div>
              </div>

              <div className="p-8">
                {selectedFormat?.id === 'image' ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                      {/* Placeholder for actual image if backend returned URL, else mock */}
                      <div className="text-center p-6">
                        <ImageIcon size={48} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">Image Job Queued: {result.jobId}</p>
                        <p className="text-sm text-gray-500 mt-2">Check 'Assets' tab for results</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black/50 rounded-xl border border-white/5">
                      <p className="text-sm text-gray-400 font-mono">Prompt: {result.refinedPrompt || prompt}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {result.hooks && Array.isArray(result.hooks) ? (
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-gray-200">Generated Scripts/Hooks</h3>
                        {result.hooks.map((hook: string, i: number) => (
                          <div key={i} className="p-4 bg-black border border-white/10 rounded-xl hover:border-[#8B5CF6]/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-gray-300 leading-relaxed">{hook}</p>
                              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all">
                                <Play size={16} className="text-[#3B82F6]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
