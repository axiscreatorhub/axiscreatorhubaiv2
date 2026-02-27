import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Globe, 
  Mail, 
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function PublicMediaKit() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/mediakit/public/${slug}`);
      if (!res.ok) throw new Error('Media kit not found');
      const json = await res.json();
      setData({
        ...json,
        links: json.links ? JSON.parse(json.links) : [],
        stats: json.stats ? JSON.parse(json.stats) : {}
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-display font-bold mb-4">404</h1>
      <p className="text-gray-400 mb-8">This media kit is private or doesn't exist.</p>
      <a href="/" className="px-8 py-3 btn-viral rounded-xl font-bold">Back to AXIS</a>
    </div>
  );

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      default: return <Globe size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white font-sans selection:bg-[#8B5CF6]/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] rounded-full blur-2xl opacity-40 animate-pulse" />
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.slug}`} 
              alt={data.name} 
              className="relative w-32 h-32 rounded-full border-4 border-white/10 bg-zinc-900"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">{data.name}</h1>
          <div className="flex items-center justify-center gap-2 text-[#8B5CF6] font-bold uppercase tracking-widest text-xs mb-8">
            <Sparkles size={14} />
            <span>{data.niche} Creator</span>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light italic">
            "{data.bio}"
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {Object.entries(data.stats).map(([label, value]: [any, any], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center hover:border-[#8B5CF6]/30 transition-all group"
            >
              <BarChart3 size={24} className="mx-auto mb-4 text-[#8B5CF6] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl font-display font-bold mb-1 tracking-tight">{value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Links & CTA */}
        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className="text-center text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">Connect & Collaborate</h2>
          {data.links.map((link: any, i: number) => (
            <motion.a
              key={i}
              href={link.url}
              target="_blank"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                  {getIcon(link.platform)}
                </div>
                <span className="font-bold">{link.platform}</span>
              </div>
              <ArrowRight size={18} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full mt-12 py-6 btn-viral rounded-2xl font-bold text-lg flex items-center justify-center gap-3"
          >
            <Mail size={20} />
            Book a Collaboration
          </motion.button>
        </div>

        {/* Footer */}
        <footer className="mt-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
            Powered by <span className="text-white">AXIS</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
