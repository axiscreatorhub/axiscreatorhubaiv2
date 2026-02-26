import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Type, 
  Mic, 
  User, 
  Scissors, 
  Wand2, 
  ImageMinus, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Layers,
  MonitorPlay,
  Check,
  X,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import TutorialOverlay from '../../components/ui/TutorialOverlay';
import { useTutorial } from '../../hooks/useTutorial';
import { TUTORIALS } from '../../lib/tutorialData';

// --- Types ---

type ToolId = 'captions' | 'voice' | 'avatar' | 'style' | 'bg-remove' | 'cut';

interface Tool {
  id: ToolId;
  label: string;
  icon: any;
  color: string;
}

const TOOLS: Tool[] = [
  { id: 'captions', label: 'Auto Captions', icon: Type, color: 'text-[#3B82F6]' },
  { id: 'voice', label: 'AI Voiceover', icon: Mic, color: 'text-[#8B5CF6]' },
  { id: 'avatar', label: 'AI Avatar', icon: User, color: 'text-[#EC4899]' },
  { id: 'style', label: 'Style Transfer', icon: Wand2, color: 'text-[#3B82F6]' },
  { id: 'bg-remove', label: 'Remove BG', icon: ImageMinus, color: 'text-[#8B5CF6]' },
  { id: 'cut', label: 'Magic Cut', icon: Scissors, color: 'text-[#EC4899]' },
];

const VOICES = [
  { id: 'adam', name: 'Adam (Bold)', lang: 'en-US' },
  { id: 'bella', name: 'Bella (Soft)', lang: 'en-US' },
  { id: 'charlie', name: 'Charlie (News)', lang: 'en-UK' },
];

const AVATARS = [
  { id: '1', name: 'Professional', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: '2', name: 'Casual', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: '3', name: 'Creative', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo' },
];

const CAPTION_STYLES = [
  { id: 'hormozi', name: 'Hormozi', class: 'font-black text-[#8B5CF6] uppercase text-stroke-black' },
  { id: 'minimal', name: 'Minimal', class: 'font-medium text-white bg-black/50 px-2 rounded' },
  { id: 'karaoke', name: 'Karaoke', class: 'font-bold text-[#EC4899]' },
];

// --- Components ---

export default function EditPage() {
  const [project, setProject] = useState<File | string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewMode, setPreviewMode] = useState<'original' | 'edited'>('edited');
  const [processing, setProcessing] = useState(false);
  
  // Tutorial Hook
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial('edit');
  
  // Tool States
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(CAPTION_STYLES[0]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProject(e.target.files[0]);
    }
  };

  const handleExport = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert('Video exported successfully!');
    }, 2000);
  };

  // --- Render: Upload State ---
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto h-[80vh] flex flex-col items-center justify-center relative">
        {showTutorial && (
          <TutorialOverlay 
            moduleName="Magic Editor" 
            steps={TUTORIALS.edit} 
            onComplete={completeTutorial} 
          />
        )}
        
        <button 
          onClick={resetTutorial}
          className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white transition-colors"
          title="Replay Tutorial"
        >
          <HelpCircle size={20} />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            AI Magic Editor
          </h1>
          <p className="text-gray-400">Upload a video or image to start editing.</p>
        </div>

        <div className="w-full max-w-xl aspect-video border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 hover:border-white/20 transition-all cursor-pointer relative group">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleUpload}
            accept="video/*,image/*"
          />
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload size={32} className="text-gray-400 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-1">Click to Upload</h3>
          <p className="text-sm text-gray-500">MP4, MOV, PNG, JPG supported</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xl">
          {['Demo Project 1', 'Demo Project 2', 'Demo Project 3'].map((p, i) => (
            <button 
              key={i}
              onClick={() => setProject('demo')}
              className="p-4 bg-zinc-900 border border-white/5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Render: Editor State ---
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      
      {/* LEFT: Tool Sidebar */}
      <div className="w-full lg:w-20 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all min-w-[80px] lg:w-full aspect-square",
              activeTool === tool.id 
                ? "bg-white/10 text-white border border-white/10" 
                : "bg-zinc-900/50 text-gray-500 hover:bg-zinc-900 hover:text-gray-300"
            )}
          >
            <tool.icon size={24} className={cn(activeTool === tool.id ? tool.color : "")} />
            <span className="text-[10px] font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* CENTER: Preview Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPreviewMode('original')}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-colors", previewMode === 'original' ? "bg-white text-black" : "text-gray-400 hover:text-white")}
            >
              Original
            </button>
            <button 
              onClick={() => setPreviewMode('edited')}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-colors", previewMode === 'edited' ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white" : "text-gray-400 hover:text-white")}
            >
              Magic Edit
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={handleExport}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              {processing ? 'Exporting...' : <><Download size={16} /> Export</>}
            </button>
          </div>
        </div>

        {/* Video Player Placeholder */}
        <div className="flex-1 bg-black rounded-2xl border border-white/10 relative overflow-hidden group">
          {/* Mock Video Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-30">
              <MonitorPlay size={64} className="mx-auto mb-4" />
              <p>Preview Player</p>
            </div>
          </div>

          {/* Overlay Elements (Mock) */}
          {activeTool === 'captions' && previewMode === 'edited' && (
            <div className="absolute bottom-20 left-0 right-0 text-center px-8">
              <span className={cn("text-2xl shadow-black drop-shadow-lg", selectedCaptionStyle.class)}>
                THIS IS AN AUTO-GENERATED CAPTION
              </span>
            </div>
          )}

          {activeTool === 'avatar' && previewMode === 'edited' && (
            <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
              <img src={selectedAvatar.img} alt="Avatar" className="w-full h-full object-cover bg-zinc-800" />
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform text-white"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            </button>
          </div>
        </div>

        {/* Timeline (Mock) */}
        <div className="h-24 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col gap-2 overflow-hidden">
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>00:00</span>
            <span>00:15</span>
            <span>00:30</span>
          </div>
          <div className="flex-1 flex gap-1 items-center relative">
            {/* Playhead */}
            <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-[#8B5CF6] z-10">
              <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-[#8B5CF6] rotate-45" />
            </div>
            
            {/* Tracks */}
            <div className="flex-1 h-full bg-zinc-800 rounded-lg overflow-hidden flex">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/5 bg-zinc-700/50" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Properties Panel */}
      <AnimatePresence mode="wait">
        {activeTool && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:block bg-zinc-900 border-l border-white/10 overflow-hidden"
          >
            <div className="w-80 p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {TOOLS.find(t => t.id === activeTool)?.icon({ size: 20 })}
                  {TOOLS.find(t => t.id === activeTool)?.label}
                </h3>
                <button onClick={() => setActiveTool(null)} className="text-gray-500 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Tool Specific Controls */}
              <div className="space-y-6">
                
                {activeTool === 'captions' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Caption Style</label>
                      <div className="grid grid-cols-1 gap-2">
                        {CAPTION_STYLES.map(style => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedCaptionStyle(style)}
                            className={cn(
                              "p-3 rounded-xl border text-left transition-all",
                              selectedCaptionStyle.id === style.id 
                                ? "bg-white/10 border-yellow-500" 
                                : "bg-black border-white/10 hover:border-white/30"
                            )}
                          >
                            <div className="font-bold text-sm mb-1">{style.name}</div>
                            <div className={cn("text-xs", style.class)}>Sample Text</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold rounded-xl hover:opacity-90">
                      Generate Captions
                    </button>
                  </>
                )}

                {activeTool === 'voice' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Select Voice</label>
                      <div className="space-y-2">
                        {VOICES.map(voice => (
                          <button
                            key={voice.id}
                            onClick={() => setSelectedVoice(voice)}
                            className={cn(
                              "w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all",
                              selectedVoice.id === voice.id 
                                ? "bg-white/10 border-[#8B5CF6]" 
                                : "bg-black border-white/10 hover:border-white/30"
                            )}
                          >
                            <div>
                              <div className="font-bold text-sm">{voice.name}</div>
                              <div className="text-xs text-gray-500">{voice.lang}</div>
                            </div>
                            {selectedVoice.id === voice.id && <Check size={16} className="text-[#8B5CF6]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Script</label>
                      <textarea 
                        className="w-full h-32 bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#8B5CF6] outline-none resize-none"
                        placeholder="Type what you want the AI to say..."
                      />
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-bold rounded-xl hover:opacity-90">
                      Generate Audio
                    </button>
                  </>
                )}

                {activeTool === 'avatar' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Choose Presenter</label>
                      <div className="grid grid-cols-2 gap-3">
                        {AVATARS.map(avatar => (
                          <button
                            key={avatar.id}
                            onClick={() => setSelectedAvatar(avatar)}
                            className={cn(
                              "p-2 rounded-xl border transition-all relative overflow-hidden group",
                              selectedAvatar.id === avatar.id 
                                ? "border-[#EC4899] ring-1 ring-[#EC4899]" 
                                : "border-white/10 hover:border-white/30"
                            )}
                          >
                            <img src={avatar.img} alt={avatar.name} className="w-full aspect-square rounded-lg bg-zinc-800 mb-2" />
                            <div className="text-xs font-medium text-center">{avatar.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white font-bold rounded-xl hover:opacity-90">
                      Add to Scene
                    </button>
                  </>
                )}

                {/* Generic Placeholder for other tools */}
                {!['captions', 'voice', 'avatar'].includes(activeTool) && (
                  <div className="text-center py-10 text-gray-500">
                    <Wand2 size={32} className="mx-auto mb-4 opacity-50" />
                    <p>Configure settings for {TOOLS.find(t => t.id === activeTool)?.label}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
