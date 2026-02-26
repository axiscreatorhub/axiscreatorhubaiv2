import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  PenTool, 
  Image as ImageIcon, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus,
  Zap,
  Loader2,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Play
} from 'lucide-react';
import UsageIndicator from '../components/ui/UsageIndicator';
import TierBadge from '../components/ui/TierBadge';
import UpgradeModal from '../components/ui/UpgradeModal';
import { apiClient, useAppAuth } from '../lib/api';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getToken } = useAppAuth();
  const [user, setUser] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  
  // Hook Generator State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [format, setFormat] = useState('Listicle');
  const [generating, setGenerating] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      navigate('/auth?mode=login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchUsage();
  }, [navigate]);

  const fetchUsage = async () => {
    try {
      const data = await apiClient('/usage', {}, getToken);
      setUsageData(data);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleGenerateHooks = async () => {
    setGenerating(true);
    try {
      const data = await apiClient('/hooks/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, tone, format }),
      }, getToken);
      
      setGeneratedHooks(data.hooks);
      fetchUsage(); // Refresh usage after generation
    } catch (error: any) {
      console.error('Failed to generate hooks:', error);
      if (error.message?.includes('Limit reached')) {
        setUpgradeFeature('Unlimited Hooks');
        setShowUpgradeModal(true);
      } else {
        alert('Failed to generate hooks. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen text-white font-sans">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        feature={upgradeFeature} 
      />

      {/* Main Content */}
      <div className="space-y-8">
        
        {/* --- Welcome Section --- */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-white">Hello, </span>
              <span className="text-gradient-viral">{user.fullName?.split(' ')[0] || 'Creator'}</span>
            </h1>
            <p className="text-gray-400 text-lg">Your creative studio is ready. Let's make magic.</p>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => navigate('/app/create')}
               className="px-6 py-3 btn-viral rounded-full font-bold flex items-center gap-2"
             >
               <Plus size={20} />
               New Project
             </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          /* --- Bento Grid Layout --- */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* 1. Usage Stats (Glass Card) */}
            <div className="md:col-span-1 glass-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#E1306C]">
                <Zap size={80} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium">Monthly Usage</h3>
                  <TierBadge planId={usageData?.plan?.id || 'FREE'} />
                </div>
                <div className="space-y-6">
                  <UsageIndicator 
                    label="AI Hooks" 
                    current={usageData?.usage?.hooks || 0} 
                    limit={usageData?.limits?.hooks || 10} 
                    color="bg-gradient-to-r from-[#FCAF45] to-[#E1306C]"
                  />
                  <UsageIndicator 
                    label="Assets" 
                    current={usageData?.usage?.assets || 0} 
                    limit={usageData?.limits?.assets || 5} 
                    color="bg-gradient-to-r from-[#405DE6] to-[#5851DB]"
                  />
                </div>
              </div>
              <button className="mt-6 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
                View Analytics
              </button>
            </div>

            {/* 2. Featured Creation (Large Card) */}
            <div className="md:col-span-2 lg:col-span-2 glass-card rounded-3xl p-0 relative overflow-hidden group cursor-pointer min-h-[300px]">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
                alt="Featured" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/10">
                    TRENDING
                  </span>
                  <span className="text-gray-300 text-xs flex items-center gap-1">
                    <TrendingUp size={12} /> +24% engagement
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Cyberpunk Aesthetic Guide</h3>
                <p className="text-gray-300 text-sm line-clamp-2 max-w-md">
                  Generated using the new "Neon Noir" style preset. Perfect for tech reviews and gaming content.
                </p>
              </div>
              
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <ArrowUpRight size={20} />
              </div>
            </div>

            {/* 3. Quick Action: AI Assistant */}
            <div 
              onClick={() => navigate('/app/assist')}
              className="md:col-span-1 glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors border-purple-500/20 hover:border-purple-500/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">AI Assistant</h3>
              <p className="text-sm text-gray-400">Brainstorm ideas & scripts</p>
            </div>

            {/* 4. Recent Asset Gallery */}
            <div className="md:col-span-2 lg:col-span-3 glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Recent Assets</h3>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">View All</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=400&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1614728853913-1e221a6572e0?w=400&auto=format&fit=crop&q=60"
                ].map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer">
                    <img src={src} alt="Asset" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors">
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Inspiration / Tutorial */}
            <div className="md:col-span-1 glass-card rounded-3xl p-0 relative overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=60" 
                alt="Tutorial" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Play size={20} fill="currentColor" />
                </div>
                <h3 className="font-bold text-lg mb-1">Master Class</h3>
                <p className="text-xs text-gray-300">How to go viral in 2025</p>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'hooks' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Viral Hook Generator</h2>
              <p className="text-gray-400">Generate scroll-stopping hooks for your next video.</p>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="e.g. Productivity hacks for students"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Witty">Witty</option>
                      <option value="Controversial">Controversial</option>
                      <option value="Empathetic">Empathetic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Format</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    >
                      <option value="Listicle">Listicle</option>
                      <option value="Storytime">Storytime</option>
                      <option value="How-to">How-to</option>
                      <option value="Mistake">Mistake</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGenerateHooks}
                  disabled={generating || !topic}
                  className="w-full bg-orange-500 text-black font-bold py-3 rounded-lg hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Generate Hooks
                    </>
                  )}
                </button>
              </div>
            </div>

            {generatedHooks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Results</h3>
                {generatedHooks.map((hook, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start justify-between gap-4 group hover:border-orange-500/30 transition-colors"
                  >
                    <p className="text-gray-200">{hook}</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(hook)}
                      className="p-2 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy to clipboard"
                    >
                      <span className="text-xs">Copy</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'hooks' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Settings size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-gray-400">This module is under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
