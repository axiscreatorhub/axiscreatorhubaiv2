import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Target,
  LineChart,
  ArrowUpRight
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';
import { useLocation } from 'react-router-dom';

export default function PerformancePredictorPage() {
  const { getToken } = useAppAuth();
  const location = useLocation();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [content, setContent] = useState(location.state?.content || '');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any | null>(null);

  useEffect(() => {
    if (location.state?.topic && location.state?.content) {
      handlePredict();
    }
  }, []);

  const handlePredict = async () => {
    const targetTopic = topic || location.state?.topic;
    const targetContent = content || location.state?.content;
    if (!targetTopic || !targetContent) return;
    
    setLoading(true);
    try {
      const data = await apiClient('/ai/predict-performance', {
        method: 'POST',
        body: JSON.stringify({ topic: targetTopic, content: targetContent })
      }, getToken);
      setPrediction(data);
    } catch (error) {
      console.error(error);
      alert('Failed to predict performance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">
          Performance <span className="text-gradient-viral">Predictor.</span>
        </h1>
        <p className="text-gray-400">AI-powered viral potential analysis before you even hit record.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Video Topic</label>
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. My AI Workflow"
                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-[#8B5CF6] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Script / Concept</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your script or detailed concept here..."
                className="w-full h-64 bg-black border border-white/10 rounded-3xl p-6 text-sm focus:border-[#8B5CF6] outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handlePredict}
              disabled={loading || !topic || !content}
              className="w-full py-5 btn-viral flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <TrendingUp size={20} />}
              Predict Viral Potential
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {prediction ? (
              <div className="space-y-8">
                {/* Score Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center gap-12 border-[#8B5CF6]/20"
                >
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-white/5"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552.92}
                        strokeDashoffset={552.92 * (1 - prediction.score / 100)}
                        className="text-[#8B5CF6] transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-display font-bold">{prediction.score}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Viral Score</span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-8">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Engagement</div>
                      <div className="text-2xl font-bold text-white flex items-center gap-2">
                        {prediction.engagement}
                        <ArrowUpRight size={16} className="text-green-500" />
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Retention</div>
                      <div className="text-2xl font-bold text-white flex items-center gap-2">
                        {prediction.retention}
                        <div className={`w-2 h-2 rounded-full ${prediction.retention === 'High' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Strengths */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-[2.5rem] p-8 space-y-6"
                  >
                    <h3 className="text-lg font-bold flex items-center gap-2 text-green-400">
                      <CheckCircle2 size={20} />
                      Key Strengths
                    </h3>
                    <ul className="space-y-4">
                      {prediction.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Improvements */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-[2.5rem] p-8 space-y-6"
                  >
                    <h3 className="text-lg font-bold flex items-center gap-2 text-yellow-400">
                      <AlertCircle size={20} />
                      Critical Improvements
                    </h3>
                    <ul className="space-y-4">
                      {prediction.improvements.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <LineChart size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">Ready to Predict</h2>
                <p className="text-gray-500 max-w-xs">Input your video topic and script to see how it might perform and how to make it go viral.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
