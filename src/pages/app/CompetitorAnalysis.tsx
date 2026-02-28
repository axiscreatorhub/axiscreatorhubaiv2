import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  RefreshCw, 
  Target, 
  ShieldAlert, 
  Zap, 
  Lightbulb,
  ArrowRight,
  User
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';

export default function CompetitorAnalysisPage() {
  const { getToken } = useAppAuth();
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleAnalyze = async () => {
    if (!competitorUrl) return;
    setLoading(true);
    try {
      const data = await apiClient('/ai/analyze-competitor', {
        method: 'POST',
        body: JSON.stringify({ competitorUrl })
      }, getToken);
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze competitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">
          Competitor <span className="text-gradient-viral">Intelligence.</span>
        </h1>
        <p className="text-gray-400">Deconstruct viral strategies and find gaps in your niche.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Competitor Profile / URL</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                  placeholder="e.g. @mrbeast or youtube.com/..."
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#8B5CF6] outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !competitorUrl}
              className="w-full py-5 btn-viral flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Search size={20} />}
              Analyze Strategy
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-500" />
              Intelligence Tip
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Don't just copy. Look for "Competitive Gaps"—topics your competitors are ignoring or formats they aren't using.
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {analysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Content Pillars */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-[2.5rem] p-8 space-y-6"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[#3B82F6]">
                    <Target size={20} />
                    Content Pillars
                  </h3>
                  <ul className="space-y-4">
                    {analysis.pillars.map((p: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Engagement Hooks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-[2.5rem] p-8 space-y-6"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[#8B5CF6]">
                    <Zap size={20} />
                    Engagement Hooks
                  </h3>
                  <ul className="space-y-4">
                    {analysis.hooks.map((h: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Competitive Gaps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-[2.5rem] p-8 space-y-6 border-l-4 border-l-red-500/50"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-red-400">
                    <ShieldAlert size={20} />
                    Competitive Gaps
                  </h3>
                  <ul className="space-y-4">
                    {analysis.gaps.map((g: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Actionable Tactics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-[2.5rem] p-8 space-y-6 border-l-4 border-l-green-500/50"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-green-400">
                    <Sparkles size={20} />
                    Actionable Tactics
                  </h3>
                  <ul className="space-y-4">
                    {analysis.tactics.map((t: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <Target size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">Ready to Analyze</h2>
                <p className="text-gray-500 max-w-xs">Enter a competitor's profile or URL to deconstruct their viral strategy and find your edge.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
