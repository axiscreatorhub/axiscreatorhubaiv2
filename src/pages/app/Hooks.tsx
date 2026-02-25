import { useState } from 'react';
import { useAppAuth, apiClient } from '../../lib/api';
import { Loader2, Zap, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function HooksPage() {
  const { getToken } = useAppAuth();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await apiClient('/hooks/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, tone: 'Professional', format: 'Listicle' })
      }, getToken);
      setHooks(res.hooks);
    } catch (error) {
      console.error(error);
      alert('Failed to generate hooks');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Viral Hook Generator</h1>
        <p className="text-gray-400">Generate scroll-stopping hooks for your next video.</p>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex gap-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What is your video about? (e.g. Productivity hacks for students)"
            className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="bg-orange-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-orange-400 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
            Generate
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {hooks.map((hook, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/20 transition-colors"
          >
            <p className="text-gray-200 font-medium">{hook}</p>
            <button
              onClick={() => copyToClipboard(hook, i)}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              {copiedIndex === i ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
