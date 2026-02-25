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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Setup your Brand Profile</h1>
          <p className="text-gray-400">This helps our AI generate content that sounds like you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-white/10 p-8 rounded-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
            <input
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
              placeholder="e.g. Acme Creators"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Niche / Industry</label>
            <input
              required
              value={formData.niche}
              onChange={e => setFormData({...formData, niche: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
              placeholder="e.g. Fitness, Tech, Lifestyle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tone of Voice</label>
            <select
              value={formData.tone}
              onChange={e => setFormData({...formData, tone: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
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
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    formData.platforms.includes(p)
                      ? 'bg-orange-500 border-orange-500 text-black'
                      : 'bg-black border-white/10 text-gray-400 hover:border-white/30'
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
            className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
