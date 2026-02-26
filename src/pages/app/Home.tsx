import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Clock,
  TrendingUp,
  Zap,
  Play
} from 'lucide-react';

export default function HomePage() {
  const quickActions = [
    { label: 'Viral Hook', icon: PenTool, color: 'from-[#3B82F6] to-[#8B5CF6]', href: '/app/create' },
    { label: 'Thumbnail', icon: ImageIcon, color: 'from-[#8B5CF6] to-[#EC4899]', href: '/app/create' },
    { label: 'Caption', icon: Sparkles, color: 'from-[#EC4899] to-[#3B82F6]', href: '/app/edit' },
    { label: 'Idea Gen', icon: Zap, color: 'from-[#3B82F6] via-[#8B5CF6] to-[#EC4899]', href: '/app/assist' },
  ];

  const recentProjects = [
    { title: 'Summer Vlog Hooks', type: 'Hooks', date: '2h ago', icon: PenTool },
    { title: 'Tech Review Thumb', type: 'Image', date: '5h ago', icon: ImageIcon },
    { title: 'LinkedIn Strategy', type: 'Chat', date: '1d ago', icon: Sparkles },
  ];

  const trendingTemplates = [
    { title: 'Day in the Life', category: 'TikTok', plays: '2.4M' },
    { title: 'Educational Carousel', category: 'Instagram', plays: '850K' },
    { title: 'Podcast Clip', category: 'Shorts', plays: '1.2M' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-0">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center md:text-left relative"
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8B5CF6]/20 rounded-full blur-[100px] animate-blob" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
          <span className="text-xs font-bold tracking-[0.2em] text-[#8B5CF6] uppercase font-display">THE CREATOR ENGINE</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tighter relative z-10 leading-[0.85]">
          <span className="text-white">
            TRANSCEND THE
          </span>
          <br />
          <span className="text-gradient-viral">
            ALGORITHM.
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-2xl max-w-2xl relative z-10 mb-10 leading-relaxed font-accent font-light">
          Your journey from creator to icon starts here. AXIS is the definitive AI Operating System for those who refuse to be ignored.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link 
            to="/app/create"
            className="btn-viral px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2"
          >
            Start Creating Free <ArrowRight size={20} />
          </Link>
          <Link 
            to="/app/monetize"
            className="px-8 py-4 rounded-xl text-lg font-medium bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            View Pricing
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link 
              to={action.href}
              className="group relative block aspect-square rounded-[2rem] overflow-hidden glass-card hover:border-white/30 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-500`}>
                  <action.icon className="text-white" size={32} />
                </div>
                <span className="font-bold text-white text-lg">{action.label}</span>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock size={24} className="text-[#3B82F6]" />
              Recent Projects
            </h2>
            <Link to="/app/create" className="text-sm text-gray-400 hover:text-white transition-colors">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentProjects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-center gap-6 p-5 glass-card rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-[#8B5CF6]/50 transition-all">
                  <project.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.type} • {project.date}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending Templates */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp size={24} className="text-[#EC4899]" />
              Trending
            </h2>
          </div>

          <div className="space-y-4">
            {trendingTemplates.map((template, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="p-5 glass-card rounded-2xl relative overflow-hidden group cursor-pointer hover:border-[#8B5CF6]/30 transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#EC4899]">
                  <Sparkles size={48} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{template.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5">{template.category}</span>
                  <span className="flex items-center gap-1"><Play size={10} fill="currentColor"/> {template.plays}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Assistant Teaser */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#8B5CF6]/40 to-[#3B82F6]/40 border border-[#8B5CF6]/30 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">AI Assistant</span>
            </div>
            
            <p className="text-white/80 mb-6 relative z-10 leading-relaxed">
              "I can help you plan your content strategy for next week. Want to try?"
            </p>
            
            <Link 
              to="/app/assist"
              className="block w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-center rounded-xl font-medium transition-all relative z-10"
            >
              Chat Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
