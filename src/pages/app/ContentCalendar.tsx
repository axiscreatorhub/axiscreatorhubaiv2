import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Smartphone, 
  Video, 
  Youtube,
  Target,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';

const PLATFORM_ICONS: any = {
  TikTok: Smartphone,
  Reels: Video,
  Shorts: Youtube,
};

export default function ContentCalendarPage() {
  const { getToken } = useAppAuth();
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<any[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await apiClient('/ai/content-calendar', {
        method: 'POST'
      }, getToken);
      setCalendar(data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate content calendar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">
            Viral <span className="text-gradient-viral">Calendar.</span>
          </h1>
          <p className="text-gray-400">Your AI-optimized 7-day content roadmap.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-8 py-4 btn-viral flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
          Generate 7-Day Plan
        </button>
      </div>

      <AnimatePresence mode="wait">
        {calendar ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calendar.map((day, i) => {
              const Icon = PLATFORM_ICONS[day.platform] || Video;
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-[2rem] p-6 flex flex-col h-full border-white/5 hover:border-[#8B5CF6]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold">
                      {day.day}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Day {day.day}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-bold leading-tight group-hover:text-[#8B5CF6] transition-colors">
                      {day.topic}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Zap size={14} className="text-yellow-500 mt-1 shrink-0" />
                        <p className="text-xs text-gray-400 leading-relaxed italic">"{day.hook}"</p>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5">
                          <Icon size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{day.platform}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target size={14} className="text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{day.goal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="mt-8 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    Create Script <ChevronRight size={12} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <Calendar size={40} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">No Plan Generated</h2>
            <p className="text-gray-500 max-w-xs">Click the button above to generate a 7-day viral content roadmap tailored to your brand.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
