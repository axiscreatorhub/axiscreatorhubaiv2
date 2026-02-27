import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  ArrowRight, 
  Clock,
  TrendingUp,
  Zap,
  Play,
  Brain,
  Search,
  ChevronRight,
  Target,
  Rocket,
  FileText,
  Send,
  Split
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';

export default function HomePage() {
  const { getToken } = useAppAuth();
  const [trends, setTrends] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    fetchTrends();
    fetchSuggestions();
  }, []);

  const fetchTrends = async () => {
    try {
      const data = await apiClient('/ai/trends', {}, getToken);
      setTrends(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTrends(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await apiClient('/ai/suggestions', {}, getToken);
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const quickActions = [
    { label: 'Viral Script', icon: PenTool, color: 'from-[#3B82F6] to-[#8B5CF6]', href: '/app/scripts' },
    { label: 'A/B Strategy', icon: Split, color: 'from-[#8B5CF6] to-[#EC4899]', href: '/app/thumbnails' },
    { label: 'Pro Pitch', icon: Send, color: 'from-[#EC4899] to-[#3B82F6]', href: '/app/outreach' },
    { label: 'AI Brain', icon: Brain, color: 'from-[#3B82F6] via-[#8B5CF6] to-[#EC4899]', href: '/app/assist' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Hero / Command Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-4"
          >
            <Sparkles size={14} className="text-[#8B5CF6]" />
            <span className="text-[10px] font-bold tracking-widest text-[#8B5CF6] uppercase">AI Command Center</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">
            Your Creative <span className="text-gradient-viral">Empire.</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Link to="/app/scripts" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2">
            <Zap size={18} /> New Script
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: AI Proactive Suggestions (Bento Style) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link 
                  key={i}
                  to={action.href}
                  className="group relative p-6 rounded-3xl bg-[#0A0E1A]/60 border border-white/5 hover:border-white/20 transition-all overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <action.icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">{action.label}</span>
                </Link>
              ))}
            </div>

            {/* Proactive Suggestions */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Brain size={20} className="text-[#8B5CF6]" />
                AI Proactive Suggestions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loadingSuggestions ? (
                  [1, 2, 3].map(i => <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />)
                ) : (
                  suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#8B5CF6]/30 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center mb-4 text-[#8B5CF6]">
                          <Rocket size={16} />
                        </div>
                        <h3 className="font-bold text-sm mb-2">{s.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{s.description}</p>
                      </div>
                      <Link to={s.href} className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                        {s.action} <ChevronRight size={12} />
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Scripts (Mini View) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock size={20} className="text-[#3B82F6]" />
                  Recent Scripts
                </h2>
                <Link to="/app/scripts" className="text-xs text-gray-500 hover:text-white transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-gray-500">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Why AI is the future of creation</h3>
                        <p className="text-[10px] text-gray-500 uppercase">TikTok • 2h ago</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Real-Time Trend Scout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-[#0A0E1A]/80 border border-white/10 backdrop-blur-xl sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Search size={20} className="text-[#EC4899]" />
                Trend Scout
              </h2>
              <div className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-[8px] font-bold uppercase animate-pulse">Live</div>
            </div>

            <div className="space-y-6">
              {loadingTrends ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)
              ) : (
                trends.map((trend, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-[#EC4899] transition-colors">{trend.title}</h3>
                        <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{trend.reason}</p>
                      </div>
                    </div>
                    <div className="ml-5 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-gray-400 italic">
                      "Idea: {trend.idea}"
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <button 
              onClick={fetchTrends}
              className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all"
            >
              Refresh Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
