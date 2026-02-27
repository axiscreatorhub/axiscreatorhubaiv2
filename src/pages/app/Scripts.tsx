import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Wand2, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Clock,
  ChevronRight,
  Smartphone,
  Video,
  Youtube,
  Volume2,
  ImageIcon,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const FORMATS = [
  { id: 'TIKTOK', label: 'TikTok', icon: Smartphone, color: 'text-[#00f2ea]' },
  { id: 'REELS', label: 'Instagram Reels', icon: Video, color: 'text-[#e1306c]' },
  { id: 'SHORTS', label: 'YouTube Shorts', icon: Youtube, color: 'text-[#ff0000]' },
];

export default function ScriptsPage() {
  const { getToken } = useAppAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('TIKTOK');
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<any[]>([]);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const data = await apiClient('/scripts', {}, getToken);
      setScripts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const script = await apiClient('/scripts/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, format })
      }, getToken);
      setScripts([script, ...scripts]);
      setSelectedScript(script);
      setTopic('');
    } catch (error) {
      console.error(error);
      alert('Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!selectedScript) return;
    navigator.clipboard.writeText(selectedScript.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTTS = async () => {
    if (!selectedScript) return;
    setTtsLoading(true);
    setAudioUrl(null);
    try {
      const { audioUrl } = await apiClient('/ai/tts', {
        method: 'POST',
        body: JSON.stringify({ text: selectedScript.content })
      }, getToken);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error(error);
      alert('Failed to generate voiceover');
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Generator */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Wand2 size={20} className="text-[#8B5CF6]" />
              Script Architect
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Topic / Hook Idea</label>
                <textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Why every creator needs a niche in 2025"
                  className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm focus:border-[#8B5CF6] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        format === f.id ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]' : 'bg-black border-white/10'
                      }`}
                    >
                      <f.icon size={20} className={f.color} />
                      <span className="text-[10px] font-bold uppercase">{f.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic}
                className="w-full py-4 btn-viral flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <span className="animate-spin">⏳</span> : <Sparkles size={18} />}
                Generate Viral Script
              </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
              <Clock size={16} />
              Recent Scripts
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {scripts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScript(s)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all group ${
                    selectedScript?.id === s.id ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <p className="text-sm font-bold truncate mb-1">{s.topic}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase">{s.format}</span>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedScript ? (
              <motion.div
                key={selectedScript.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-[2.5rem] p-8 md:p-12 min-h-[600px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-[0.2em] mb-2 block">Generated Script</span>
                    <h2 className="text-2xl font-display font-bold">{selectedScript.topic}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    {selectedScript.viralScore && (
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Viral Score</div>
                        <div className={`text-2xl font-display font-bold ${
                          selectedScript.viralScore > 80 ? 'text-green-400' : 
                          selectedScript.viralScore > 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {selectedScript.viralScore}%
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCopy}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                        title="Copy to Clipboard"
                      >
                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                      </button>
                      <button 
                        onClick={handleTTS}
                        disabled={ttsLoading}
                        className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-all text-[#8B5CF6]"
                        title="Generate AI Voiceover"
                      >
                        {ttsLoading ? <span className="animate-spin">⏳</span> : <Volume2 size={20} />}
                      </button>
                      <button 
                        onClick={() => navigate('/app/thumbnails', { state: { topic: selectedScript.topic } })}
                        className="px-4 py-3 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 hover:bg-gray-200 transition-all"
                      >
                        <ImageIcon size={16} /> Thumbnail Strategy <ArrowRight size={14} />
                      </button>
                      <button 
                        onClick={() => navigate('/app/predict', { state: { topic: selectedScript.topic, content: selectedScript.content } })}
                        className="px-4 py-3 rounded-xl bg-[#8B5CF6] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#7C3AED] transition-all"
                      >
                        <TrendingUp size={16} /> Predict Performance
                      </button>
                    </div>
                  </div>
                </div>

                {audioUrl && (
                  <div className="mb-8 p-4 bg-[#8B5CF6]/10 rounded-2xl border border-[#8B5CF6]/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                      <Play size={20} className="text-white" />
                    </div>
                    <audio src={audioUrl} controls className="flex-1 h-8" />
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Script Content</h3>
                    <div className="bg-black/40 rounded-3xl p-8 border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300 h-full">
                      {selectedScript.content}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Visual Storyboard</h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {selectedScript.storyboard ? JSON.parse(selectedScript.storyboard).map((scene: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-[10px] font-bold">
                              {scene.scene}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visual Cue</span>
                          </div>
                          <p className="text-xs text-white mb-3 italic">"{scene.visual}"</p>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Audio</div>
                          <p className="text-xs text-gray-400">{scene.audio}</p>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-gray-500 text-sm italic">
                          No storyboard generated for this script.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <FileText size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">No Script Selected</h2>
                <p className="text-gray-500 max-w-xs">Generate a new script or select one from your history to view the details.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
