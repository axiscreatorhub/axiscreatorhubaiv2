import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  Save, 
  Sparkles, 
  TrendingUp, 
  Hash, 
  Type, 
  Check,
  Zap,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import { useAppAuth, apiClient } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import TutorialOverlay from '../../components/ui/TutorialOverlay';
import { useTutorial } from '../../hooks/useTutorial';
import { TUTORIALS } from '../../lib/tutorialData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { 
    label: 'Viral Hooks', 
    prompt: 'Write 5 viral hooks for a video about: ', 
    icon: Zap, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-400/10 border-yellow-400/20' 
  },
  { 
    label: 'Content Ideas', 
    prompt: 'Give me 3 unique content ideas for my niche about: ', 
    icon: Lightbulb, 
    color: 'text-orange-400', 
    bg: 'bg-orange-400/10 border-orange-400/20' 
  },
  { 
    label: 'Caption Writer', 
    prompt: 'Write an engaging Instagram caption for this topic: ', 
    icon: Type, 
    color: 'text-pink-400', 
    bg: 'bg-pink-400/10 border-pink-400/20' 
  },
  { 
    label: 'Trend Finder', 
    prompt: 'What are the current trending topics in the creator economy?', 
    icon: TrendingUp, 
    color: 'text-green-400', 
    bg: 'bg-green-400/10 border-green-400/20' 
  },
  { 
    label: 'Hashtags', 
    prompt: 'Generate a set of high-reach hashtags for: ', 
    icon: Hash, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10 border-blue-400/20' 
  },
  { 
    label: 'Script Polish', 
    prompt: 'Improve this script to be more punchy and concise: ', 
    icon: Sparkles, 
    color: 'text-purple-400', 
    bg: 'bg-purple-400/10 border-purple-400/20' 
  },
];

export default function AssistPage() {
  const { getToken } = useAppAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tutorial Hook
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial('assist');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: text, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text })
      }, getToken);

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: res.reply, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting right now. Please try again.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveToProject = (id: string) => {
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
    // In a real app, this would save to a "Saved Ideas" database
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {showTutorial && (
        <TutorialOverlay 
          moduleName="AI Assistant" 
          steps={TUTORIALS.assist} 
          onComplete={completeTutorial} 
        />
      )}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-gray-400 text-sm">Your 24/7 creative strategist.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetTutorial}
            className="text-gray-500 hover:text-white transition-colors"
            title="Replay Tutorial"
          >
            <HelpCircle size={18} />
          </button>
          <button 
            onClick={() => setMessages([])}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl flex items-center justify-center mb-6 border border-purple-500/30">
                <Bot size={40} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can I help you create?</h2>
              <p className="text-gray-400 max-w-md mb-8">
                I can write scripts, generate hooks, find trends, or just brainstorm ideas with you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-3xl">
                {QUICK_PROMPTS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(action.prompt)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all hover:scale-[1.02]",
                      action.bg,
                      "hover:bg-opacity-20"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <action.icon size={18} className={action.color} />
                      <span className={cn("font-bold text-sm", action.color)}>{action.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate opacity-70">
                      "{action.prompt}..."
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    msg.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === 'assistant' 
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white" 
                      : "bg-zinc-800 text-gray-400"
                  )}>
                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className={cn(
                    "max-w-[85%] md:max-w-[75%] rounded-2xl p-5 shadow-md relative group",
                    msg.role === 'assistant' 
                      ? "bg-black border border-white/10 text-gray-200" 
                      : "bg-purple-600 text-white"
                  )}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    
                    {/* Message Actions (Assistant Only) */}
                    {msg.role === 'assistant' && (
                      <div className="absolute -bottom-8 left-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="p-1.5 bg-zinc-800 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-1.5 text-xs"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                        <button 
                          onClick={() => saveToProject(msg.id)}
                          className="p-1.5 bg-zinc-800 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-1.5 text-xs"
                        >
                          {savedId === msg.id ? <Check size={12} className="text-green-500" /> : <Save size={12} />}
                          {savedId === msg.id ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>
                  <div className="bg-black border border-white/10 p-5 rounded-2xl">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75" />
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-zinc-950/50 backdrop-blur-md">
          <div className="relative flex items-end gap-2 bg-zinc-900 border border-white/10 rounded-2xl p-2 focus-within:border-purple-500/50 transition-colors shadow-inner">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none px-4 py-3 text-white focus:ring-0 outline-none placeholder:text-gray-600 max-h-32 overflow-y-auto"
              autoComplete="off"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-600">
              AI can make mistakes. Review generated content before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
