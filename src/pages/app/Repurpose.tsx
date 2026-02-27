import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Twitter, 
  Linkedin, 
  Mail, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Send,
  FileText
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';

const PLATFORMS = [
  { id: 'Twitter Thread', icon: Twitter, color: 'text-[#1DA1F2]' },
  { id: 'LinkedIn Post', icon: Linkedin, color: 'text-[#0A66C2]' },
  { id: 'Newsletter', icon: Mail, color: 'text-[#EA4335]' },
  { id: 'Blog Post', icon: FileText, color: 'text-[#34A853]' },
];

export default function RepurposePage() {
  const { getToken } = useAppAuth();
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('Twitter Thread');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRepurpose = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const data = await apiClient('/ai/repurpose', {
        method: 'POST',
        body: JSON.stringify({ content, platform })
      }, getToken);
      setResult(data.content);
    } catch (error) {
      console.error(error);
      alert('Failed to repurpose content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">
          Viral <span className="text-gradient-viral">Repurposer.</span>
        </h1>
        <p className="text-gray-400">Turn one piece of content into a multi-platform empire.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Original Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your script, blog post, or transcript here..."
              className="w-full h-64 bg-black border border-white/10 rounded-3xl p-6 text-sm focus:border-[#8B5CF6] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Target Platform</label>
            <div className="grid grid-cols-2 gap-4">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    platform === p.id ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]' : 'bg-black border-white/10 hover:border-white/20'
                  }`}
                >
                  <p.icon size={20} className={p.color} />
                  <span className="text-sm font-bold">{p.id}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRepurpose}
            disabled={loading || !content}
            className="w-full py-5 btn-viral flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
            Repurpose with AI
          </button>
        </div>

        {/* Output Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    <Send size={20} className="text-[#8B5CF6]" />
                    {platform} Draft
                  </h2>
                  <button 
                    onClick={handleCopy}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
                <div className="flex-1 bg-black/40 rounded-3xl p-8 border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {result}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <RefreshCw size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">Ready to Repurpose</h2>
                <p className="text-gray-500 max-w-xs">Paste your content and select a platform to see the AI magic happen.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
