import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Globe, 
  ShoppingBag, 
  FileText, 
  Link as LinkIcon,
  Download,
  Check,
  ArrowRight,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Smartphone,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import BillingPage from './Billing';
import TutorialOverlay from '../../components/ui/TutorialOverlay';
import { useTutorial } from '../../hooks/useTutorial';
import { TUTORIALS } from '../../lib/tutorialData';

// --- Types ---
interface CreatorProfile {
  niche: string;
  bio: string;
  audience: {
    age: string;
    gender: string;
    location: string;
  };
  platforms: { id: string; handle: string; followers: string }[];
  offers: any[];
}

const PLATFORM_ICONS: Record<string, any> = {
  Instagram: (props: any) => <Instagram {...props} />,
  Youtube: (props: any) => <Youtube {...props} />,
  Twitter: (props: any) => <Twitter {...props} />,
  Linkedin: (props: any) => <Linkedin {...props} />,
  TikTok: (props: any) => <Smartphone {...props} />, // Using Smartphone as placeholder for TikTok
};

import { useNavigate } from 'react-router-dom';
import { apiClient, useAppAuth } from '../../lib/api';

export default function MonetizePage() {
  const { getToken } = useAppAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'mediakit' | 'links'>('overview');
  
  // Tutorial Hook
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial('monetize');

  const [stats, setStats] = useState({
    revenue: 1240,
    clicks: 8432,
    deals: 3,
    mediaKitViews: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient('/mediakit', {}, getToken);
      if (data?.mediaKit) {
        setStats(prev => ({ ...prev, mediaKitViews: data.mediaKit.viewCount }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Render: Dashboard ---
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Monetization Hub
          </h1>
          <p className="text-gray-400">Manage your income streams and brand assets.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'overview' ? "bg-white text-black" : "text-gray-400 hover:text-white")}
          >
            Overview
          </button>
          <button 
            onClick={() => navigate('/app/outreach')}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sponsor Outreach
          </button>
          <button 
            onClick={() => navigate('/app/mediakit')}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Media Kit Architect
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <DollarSign size={20} className="text-[#3B82F6]" />
                  <span>Revenue</span>
                </div>
                <div className="text-3xl font-bold">${stats.revenue.toLocaleString()}</div>
                <div className="text-xs text-[#3B82F6] mt-2">+12% this month</div>
              </div>
              <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <TrendingUp size={20} className="text-[#8B5CF6]" />
                  <span>Link Clicks</span>
                </div>
                <div className="text-3xl font-bold">{stats.clicks.toLocaleString()}</div>
                <div className="text-xs text-[#8B5CF6] mt-2">+5% this month</div>
              </div>
              <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <Users size={20} className="text-[#EC4899]" />
                  <span>Kit Views</span>
                </div>
                <div className="text-3xl font-bold">{stats.mediaKitViews}</div>
                <div className="text-xs text-[#EC4899] mt-2">Live Analytics</div>
              </div>
              <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <ShoppingBag size={20} className="text-gray-400" />
                  <span>Deals</span>
                </div>
                <div className="text-3xl font-bold">{stats.deals}</div>
                <div className="text-xs text-gray-500 mt-2">2 pending</div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Plan</h2>
              <BillingPage />
            </div>
          </motion.div>
        )}

        {activeTab === 'mediakit' && (
          <motion.div key="mediakit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white text-black rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#3B82F6]/10 to-[#EC4899]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">MEDIA KIT</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">2025</p>
                  </div>
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">About Me</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Content creator passionate about tech and lifestyle. Creating engaging content for a global audience.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold mb-2">Audience</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Age: 18-34</li>
                      <li>Loc: Global</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Reach</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Instagram: 10k</li>
                      <li>YouTube: 5k</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold mb-4">Partnership Opportunities</h4>
                  <div className="flex gap-2 flex-wrap">
                    {['Brand Integration', 'Product Review', 'Ambassadorship'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-4">
              <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold mb-4">Actions</h3>
                <button className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-3 shadow-lg">
                  <Download size={18} /> Download PDF
                </button>
                <button className="w-full py-3 bg-black/40 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <LinkIcon size={18} /> Copy Public Link
                </button>
              </div>
              <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold mb-2">AI Suggestion</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Your engagement rate is 20% higher than average. Highlight this in your bio!
                </p>
                <button className="text-[#8B5CF6] text-sm font-bold hover:underline">Apply Suggestion</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'links' && (
          <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#0A0E1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-bold text-lg">Your Links</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg">
                  Add New Link
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { title: 'My Merch Store', url: 'https://store.axis.com', clicks: 1240 },
                  { title: 'Amazon Favorites', url: 'https://amzn.to/example', clicks: 850 },
                  { title: 'Newsletter Signup', url: 'https://axis.substack.com', clicks: 420 },
                ].map((link, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-gray-400">
                        <LinkIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{link.title}</h3>
                        <p className="text-xs text-gray-500">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold text-sm">{link.clicks}</div>
                        <div className="text-xs text-gray-500">clicks</div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <FileText size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
