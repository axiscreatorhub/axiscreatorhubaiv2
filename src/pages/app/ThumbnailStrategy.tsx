import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ImageIcon, 
  Sparkles, 
  RefreshCw, 
  Split, 
  Layers, 
  Palette, 
  Zap,
  ChevronRight,
  Lightbulb,
  MousePointer2
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';
import { useLocation } from 'react-router-dom';

export default function ThumbnailStrategyPage() {
  const { getToken } = useAppAuth();
  const location = useLocation();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<any[] | null>(null);

  useEffect(() => {
    if (location.state?.topic) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    const targetTopic = topic || location.state?.topic;
    if (!targetTopic) return;
    setLoading(true);
    try {
      const data = await apiClient('/ai/thumbnail-ideas', {
        method: 'POST',
        body: JSON.stringify({ topic: targetTopic })
      }, getToken);
      setConcepts(data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate thumbnail ideas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">
          Thumbnail <span className="text-gradient-viral">A/B Strategist.</span>
        </h1>
        <p className="text-gray-400">Psychology-backed visual concepts designed to maximize your CTR.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Video Topic / Title</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is your video about? e.g. How I built a $10k/mo business with AI..."
              className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm focus:border-[#8B5CF6] outline-none resize-none leading-relaxed mb-6"
            />
            
            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full py-4 btn-viral flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
              Generate A/B Concepts
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-500" />
              Pro Tip
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              A/B testing different psychological triggers (e.g., Curiosity vs. Authority) is the fastest way to find what resonates with your specific audience.
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {concepts ? (
              <div className="grid grid-cols-1 gap-6">
                {concepts.map((concept, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-[2.5rem] p-8 border-l-4 border-l-[#8B5CF6]/50"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] font-bold text-xs">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <h3 className="text-xl font-bold">{concept.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                                <Layers size={12} /> Visual Composition
                              </label>
                              <p className="text-sm text-gray-300 leading-relaxed">{concept.visual}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                                <MousePointer2 size={12} /> Text Overlay
                              </label>
                              <p className="text-sm font-bold text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 inline-block">
                                "{concept.text}"
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                                <Zap size={12} /> Psychological Trigger
                              </label>
                              <span className="px-2 py-1 rounded-md bg-[#EC4899]/10 text-[#EC4899] text-[10px] font-bold uppercase">
                                {concept.trigger}
                              </span>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                                <Palette size={12} /> Color Palette
                              </label>
                              <div className="flex gap-2">
                                {concept.colors.map((color: string, ci: number) => (
                                  <div key={ci} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400">
                                    {color}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-48 aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ImageIcon size={32} className="text-gray-800 group-hover:text-[#8B5CF6] transition-colors" />
                        <div className="absolute bottom-3 right-3 text-[8px] font-bold text-gray-600 uppercase">Preview Mockup</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <Split size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">Ready to Strategize</h2>
                <p className="text-gray-500 max-w-xs">Enter your topic to generate 3 distinct A/B testing concepts designed to win the click.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
