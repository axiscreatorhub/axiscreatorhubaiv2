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
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hook Generator State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [format, setFormat] = useState('Listicle');
  const [generating, setGenerating] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/auth?mode=login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleGenerateHooks = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/generate/hooks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, tone, format }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setGeneratedHooks(data.hooks);
    } catch (error) {
      console.error('Failed to generate hooks:', error);
      alert('Failed to generate hooks. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-black">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">AXIS</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'hooks', label: 'Hook Generator', icon: Zap },
            { id: 'assets', label: 'Asset Studio', icon: ImageIcon },
            { id: 'calendar', label: 'Content Calendar', icon: Calendar },
            { id: 'brand', label: 'Brand Identity', icon: PenTool },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.tier} Plan</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
          <button className="md:hidden p-2 text-gray-400">
            <LayoutGrid size={24} />
          </button>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Total Hooks Generated</h3>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Assets Created</h3>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Plan Usage</h3>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-2 mb-1">
                    <div className="bg-orange-500 h-2 rounded-full w-[10%]"></div>
                  </div>
                  <p className="text-xs text-gray-500">5/50 credits used</p>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start Creating</h3>
                <p className="text-gray-400 max-w-md mb-6">
                  Generate your first batch of viral hooks or design a new asset for your brand.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('hooks')}
                    className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Generate Hooks
                  </button>
                  <button 
                    onClick={() => setActiveTab('assets')}
                    className="px-6 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Create Asset
                  </button>
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
      </main>
    </div>
  );
}
