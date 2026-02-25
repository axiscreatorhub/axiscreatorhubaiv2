import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Download, 
  Calendar, 
  Smartphone, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Check, 
  Image as ImageIcon,
  Type,
  Maximize,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import TutorialOverlay from '../../components/ui/TutorialOverlay';
import { useTutorial } from '../../hooks/useTutorial';
import { TUTORIALS } from '../../lib/tutorialData';

// --- Types ---

type PlatformId = 'tiktok' | 'instagram' | 'youtube' | 'linkedin' | 'twitter';

interface Platform {
  id: PlatformId;
  name: string;
  icon: any;
  color: string;
  ratio: '9:16' | '16:9' | '4:5' | '1:1';
  maxDuration: string;
  formats: string[];
}

const PLATFORMS: Platform[] = [
  { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-pink-500', ratio: '9:16', maxDuration: '10m', formats: ['MP4'] },
  { id: 'instagram', name: 'Reels', icon: Instagram, color: 'text-purple-500', ratio: '9:16', maxDuration: '90s', formats: ['MP4'] },
  { id: 'youtube', name: 'Shorts', icon: Youtube, color: 'text-red-500', ratio: '9:16', maxDuration: '60s', formats: ['MP4'] },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', ratio: '4:5', maxDuration: '10m', formats: ['MP4'] },
  { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'text-sky-500', ratio: '16:9', maxDuration: '2m 20s', formats: ['MP4'] },
];

const PROJECTS = [
  { id: '1', title: 'Viral AI Trends 2025', duration: '0:45', date: '2h ago', thumbnail: 'bg-gradient-to-br from-purple-900 to-blue-900' },
  { id: '2', title: 'Day in the Life Vlog', duration: '1:12', date: '5h ago', thumbnail: 'bg-gradient-to-br from-orange-900 to-red-900' },
  { id: '3', title: 'Coding Tips #4', duration: '0:30', date: '1d ago', thumbnail: 'bg-gradient-to-br from-green-900 to-emerald-900' },
];

export default function PublishPage() {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0]);
  const [exporting, setExporting] = useState(false);
  const [showThumbnailGen, setShowThumbnailGen] = useState(false);
  
  // Tutorial Hook
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial('publish');
  
  // Export Settings
  const [settings, setSettings] = useState({
    resolution: '1080p',
    fps: '60',
    burnCaptions: true,
    watermark: false,
  });

  const handleExport = () => {
    setExporting(true);
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
      alert(`Exported ${selectedProject.title} for ${selectedPlatform.name}!`);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {showTutorial && (
        <TutorialOverlay 
          moduleName="Publishing Studio" 
          steps={TUTORIALS.publish} 
          onComplete={completeTutorial} 
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Publish & Export
          </h1>
          <p className="text-gray-400 text-sm">Optimize and distribute your content.</p>
        </div>
        <button 
          onClick={resetTutorial}
          className="p-2 text-gray-500 hover:text-white transition-colors"
          title="Replay Tutorial"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* LEFT: Project Selection & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Project List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROJECTS.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all group relative overflow-hidden",
                  selectedProject.id === project.id 
                    ? "bg-white/10 border-green-500 ring-1 ring-green-500" 
                    : "bg-zinc-900 border-white/10 hover:border-white/30"
                )}
              >
                <div className={cn("w-full aspect-video rounded-lg mb-3 relative overflow-hidden", project.thumbnail)}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-mono">
                    {project.duration}
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate">{project.title}</h3>
                <p className="text-xs text-gray-500">{project.date}</p>
                
                {selectedProject.id === project.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Preview Player */}
          <div className="flex-1 bg-black border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[300px]">
            <div className={cn(
              "bg-zinc-800 transition-all duration-500 relative shadow-2xl overflow-hidden",
              selectedPlatform.ratio === '9:16' ? "aspect-[9/16] h-[80%]" : 
              selectedPlatform.ratio === '4:5' ? "aspect-[4/5] h-[70%]" : 
              selectedPlatform.ratio === '1:1' ? "aspect-square h-[70%]" : 
              "aspect-video w-[80%]"
            )}>
              {/* Mock Content */}
              <div className={cn("w-full h-full", selectedProject.thumbnail)} />
              
              {/* Overlays based on platform */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Safe Zones Mock */}
                <div className="absolute inset-4 border border-white/20 border-dashed opacity-50 rounded-lg" />
                
                {/* Platform UI Mockup */}
                {selectedPlatform.id === 'tiktok' && (
                  <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center opacity-80">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-black/40" />)}
                  </div>
                )}
              </div>

              {/* Burned Captions Simulation */}
              {settings.burnCaptions && (
                <div className="absolute bottom-1/4 left-0 right-0 text-center px-4">
                  <span className="bg-black/50 text-white font-bold px-2 py-1 rounded text-sm">
                    Auto-generated captions appear here
                  </span>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
              Previewing {selectedPlatform.name} ({selectedPlatform.ratio})
            </div>
          </div>
        </div>

        {/* RIGHT: Export Settings */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* Platform Selector */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Target Platform</h3>
            <div className="grid grid-cols-1 gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all",
                    selectedPlatform.id === platform.id 
                      ? "bg-white/10 border-green-500" 
                      : "bg-black border-white/10 hover:border-white/30"
                  )}
                >
                  <div className={cn("p-2 rounded-lg bg-zinc-800", selectedPlatform.id === platform.id ? platform.color : "text-gray-400")}>
                    <platform.icon size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-sm">{platform.name}</div>
                    <div className="text-xs text-gray-500">{platform.ratio} • Max {platform.maxDuration}</div>
                  </div>
                  {selectedPlatform.id === platform.id && <Check size={16} className="text-green-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Export Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Maximize size={16} className="text-gray-400" />
                  <span>Resolution</span>
                </div>
                <select 
                  value={settings.resolution}
                  onChange={(e) => setSettings({...settings, resolution: e.target.value})}
                  className="bg-zinc-800 border-none rounded-lg text-xs px-2 py-1 outline-none"
                >
                  <option>720p</option>
                  <option>1080p</option>
                  <option>4K</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Type size={16} className="text-gray-400" />
                  <span>Burn-in Captions</span>
                </div>
                <button 
                  onClick={() => setSettings({...settings, burnCaptions: !settings.burnCaptions})}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    settings.burnCaptions ? "bg-green-500" : "bg-zinc-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                    settings.burnCaptions ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Generator */}
          <div className="p-4 bg-gradient-to-br from-zinc-800 to-black rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-400" />
                Thumbnail
              </h3>
              <button 
                onClick={() => setShowThumbnailGen(!showThumbnailGen)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {showThumbnailGen ? 'Hide' : 'Generate'}
              </button>
            </div>
            
            <AnimatePresence>
              {showThumbnailGen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="aspect-video bg-black rounded-lg mb-2 border border-white/10 flex items-center justify-center">
                    <span className="text-xs text-gray-500">AI Generated Preview</span>
                  </div>
                  <button className="w-full py-2 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/30 transition-colors">
                    Regenerate
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-3">
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exporting ? <Loader2 className="animate-spin" /> : <Download size={20} />}
              {exporting ? 'Rendering...' : 'Export Video'}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-black border border-white/10 rounded-xl font-medium text-sm hover:bg-white/5 flex items-center justify-center gap-2">
                <Share2 size={16} /> Share Link
              </button>
              <button className="py-3 bg-black border border-white/10 rounded-xl font-medium text-sm hover:bg-white/5 flex items-center justify-center gap-2 text-gray-500 cursor-not-allowed">
                <Calendar size={16} /> Schedule
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
