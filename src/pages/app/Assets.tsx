import { useState } from 'react';
import { useAppAuth, apiClient } from '../../lib/api';
import { Loader2, Image as ImageIcon, Lock } from 'lucide-react';
import UpgradeModal from '../../components/ui/UpgradeModal';

export default function AssetsPage() {
  const { getToken } = useAppAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  // Mock Plan Check (In real app, fetch from user profile)
  const isPro = false; 

  const handleGenerate = async () => {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }

    if (!prompt) return;
    setLoading(true);
    try {
      await apiClient('/assets/generate', {
        method: 'POST',
        body: JSON.stringify({ type: 'THUMBNAIL', prompt })
      }, getToken);
      alert('Job queued! Check back later.');
    } catch (error) {
      console.error(error);
      alert('Failed to queue job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        feature="AI Asset Studio" 
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Asset Studio</h1>
        <p className="text-gray-400">Generate professional thumbnails and social assets.</p>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
        {!isPro && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <button 
              onClick={() => setShowUpgrade(true)}
              className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Lock size={18} />
              Unlock Asset Studio
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your thumbnail..."
            className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
            disabled={!isPro}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || !isPro}
            className="bg-orange-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-orange-400 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ImageIcon size={18} />}
            Generate
          </button>
        </div>
      </div>

      <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
        <p className="text-gray-500">No assets generated yet.</p>
      </div>
    </div>
  );
}
