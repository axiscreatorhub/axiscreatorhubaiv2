import { useState } from 'react';
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

export default function MonetizePage() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'mediakit' | 'links'>('overview');
  
  // Tutorial Hook
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial('monetize');

  const [profile, setProfile] = useState<CreatorProfile>({
    niche: '',
    bio: '',
    audience: { age: '18-34', gender: 'All', location: 'Global' },
    platforms: [],
    offers: []
  });

  const addPlatform = (platformId: string) => {
    if (profile.platforms.find(p => p.id === platformId)) return;
    setProfile({
      ...profile,
      platforms: [...profile.platforms, { id: platformId, handle: '', followers: '' }]
    });
  };

  const updatePlatform = (index: number, field: 'handle' | 'followers', value: string) => {
    const newPlatforms = [...profile.platforms];
    newPlatforms[index] = { ...newPlatforms[index], [field]: value };
    setProfile({ ...profile, platforms: newPlatforms });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setSetupComplete(true);
    }
  };

  // --- Render: Wizard ---
  if (!setupComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12 relative">
        {showTutorial && (
          <TutorialOverlay 
            moduleName="Monetization Hub" 
            steps={TUTORIALS.monetize} 
            onComplete={completeTutorial} 
          />
        )}

        <div className="text-center mb-12 relative">
          <button 
            onClick={resetTutorial}
            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white transition-colors"
            title="Replay Tutorial"
          >
            <HelpCircle size={20} />
          </button>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Monetization Setup
          </h1>
          <p className="text-gray-400">Let's build your creator persona and media kit.</p>
        </div>
        
        {/* ... existing wizard content ... */}
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-orange-500" : "bg-zinc-800")} />
          ))}
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Globe className="text-orange-500" /> Niche & Bio
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your Niche</label>
                    <input 
                      value={profile.niche}
                      onChange={e => setProfile({...profile, niche: e.target.value})}
                      placeholder="e.g. Tech Reviews, Fitness, Lifestyle"
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Short Bio</label>
                    <textarea 
                      value={profile.bio}
                      onChange={e => setProfile({...profile, bio: e.target.value})}
                      placeholder="I help people..."
                      className="w-full h-32 bg-black border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-orange-500" /> Audience Demographics
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Primary Age Group</label>
                    <select 
                      value={profile.audience.age}
                      onChange={e => setProfile({...profile, audience: {...profile.audience, age: e.target.value}})}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
                    >
                      <option>13-17</option>
                      <option>18-24</option>
                      <option>25-34</option>
                      <option>35-44</option>
                      <option>45+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Gender Split</label>
                    <select 
                      value={profile.audience.gender}
                      onChange={e => setProfile({...profile, audience: {...profile.audience, gender: e.target.value}})}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none"
                    >
                      <option>Balanced</option>
                      <option>Male Dominant</option>
                      <option>Female Dominant</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Smartphone className="text-orange-500" /> Platforms
                </h2>
                <div className="flex gap-2 mb-6">
                  {Object.keys(PLATFORM_ICONS).map(p => (
                    <button
                      key={p}
                      onClick={() => addPlatform(p)}
                      className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                    >
                      {PLATFORM_ICONS[p]({ size: 20 })}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {profile.platforms.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 bg-black p-3 rounded-xl border border-white/10">
                      {PLATFORM_ICONS[p.id]({ size: 20, className: "text-gray-400" })}
                      <input 
                        value={p.handle}
                        onChange={e => updatePlatform(i, 'handle', e.target.value)}
                        className="bg-transparent border-none text-sm text-white outline-none w-1/3"
                        placeholder="@handle"
                      />
                      <input 
                        value={p.followers}
                        onChange={e => updatePlatform(i, 'followers', e.target.value)}
                        className="bg-transparent border-none text-sm text-white outline-none w-1/3 text-right"
                        placeholder="10k"
                      />
                    </div>
                  ))}
                  {profile.platforms.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Select platforms above to add them.</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="text-orange-500" /> Offers & Products
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-black border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Digital Product</h3>
                      <p className="text-sm text-gray-400">E-books, presets, courses</p>
                    </div>
                    <button className="px-3 py-1 bg-white/10 rounded-lg text-sm hover:bg-white/20">Add</button>
                  </div>
                  <div className="p-4 bg-black border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Affiliate Link</h3>
                      <p className="text-sm text-gray-400">Amazon, software, etc.</p>
                    </div>
                    <button className="px-3 py-1 bg-white/10 rounded-lg text-sm hover:bg-white/20">Add</button>
                  </div>
                  <div className="p-4 bg-black border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Consulting</h3>
                      <p className="text-sm text-gray-400">1:1 calls, coaching</p>
                    </div>
                    <button className="px-3 py-1 bg-white/10 rounded-lg text-sm hover:bg-white/20">Add</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 transition-colors flex items-center gap-2"
            >
              {step === 4 ? 'Finish Setup' : 'Next Step'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Dashboard ---
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
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
            onClick={() => setActiveTab('mediakit')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'mediakit' ? "bg-white text-black" : "text-gray-400 hover:text-white")}
          >
            Media Kit
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'links' ? "bg-white text-black" : "text-gray-400 hover:text-white")}
          >
            Link Hub
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <DollarSign size={20} className="text-green-500" />
                  <span>Estimated Revenue</span>
                </div>
                <div className="text-3xl font-bold">$1,240.00</div>
                <div className="text-xs text-green-500 mt-2">+12% this month</div>
              </div>
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <TrendingUp size={20} className="text-blue-500" />
                  <span>Link Clicks</span>
                </div>
                <div className="text-3xl font-bold">8,432</div>
                <div className="text-xs text-blue-500 mt-2">+5% this month</div>
              </div>
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <ShoppingBag size={20} className="text-purple-500" />
                  <span>Active Deals</span>
                </div>
                <div className="text-3xl font-bold">3</div>
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
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
                    {profile.bio || "Content creator passionate about tech and lifestyle. Creating engaging content for a global audience."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold mb-2">Audience</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Age: {profile.audience.age}</li>
                      <li>Loc: {profile.audience.location}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Reach</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {profile.platforms.length > 0 ? profile.platforms.map(p => (
                        <li key={p.id} className="capitalize">{p.id}: {p.followers}</li>
                      )) : <li>Instagram: 10k</li>}
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
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Actions</h3>
                <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mb-3">
                  <Download size={18} /> Download PDF
                </button>
                <button className="w-full py-3 bg-black border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <LinkIcon size={18} /> Copy Public Link
                </button>
              </div>
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold mb-2">AI Suggestion</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Your engagement rate is 20% higher than average. Highlight this in your bio!
                </p>
                <button className="text-orange-500 text-sm font-bold hover:underline">Apply Suggestion</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'links' && (
          <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-bold text-lg">Your Links</h2>
                <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200">
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
