import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppAuth, apiClient } from '../../lib/api';
import { Loader2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { getToken } = useAppAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    tone: 'Professional',
    platforms: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient('/brand', {
        method: 'POST',
        body: JSON.stringify(formData)
      }, getToken);
      
      navigate('/app');
    } catch (error) {
      console.error(error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (p: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p]
    }));
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Setup your Brand Profile</h1>
          <p className="text-gray-400">This helps our AI generate content that sounds like you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
            <input
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B5CF6] outline-none transition-all"
              placeholder="e.g. Acme Creators"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Niche / Industry</label>
            <input
              required
              value={formData.niche}
              onChange={e => setFormData({...formData, niche: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B5CF6] outline-none transition-all"
              placeholder="e.g. Fitness, Tech, Lifestyle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tone of Voice</label>
            <select
              value={formData.tone}
              onChange={e => setFormData({...formData, tone: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#8B5CF6] outline-none transition-all"
            >
              <option>Professional</option>
              <option>Witty</option>
              <option>Casual</option>
              <option>Inspirational</option>
              <option>Controversial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platforms</label>
            <div className="flex gap-3 flex-wrap">
              {['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    formData.platforms.includes(p)
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] border-transparent text-white shadow-lg'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
