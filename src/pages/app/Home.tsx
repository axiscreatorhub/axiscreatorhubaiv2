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
  Zap
} from 'lucide-react';

export default function HomePage() {
  const quickActions = [
    { label: 'Viral Hook', icon: PenTool, color: 'from-orange-400 to-pink-500', href: '/app/create' },
    { label: 'Thumbnail', icon: ImageIcon, color: 'from-blue-400 to-cyan-500', href: '/app/create' },
    { label: 'Caption', icon: Sparkles, color: 'from-purple-400 to-indigo-500', href: '/app/edit' },
    { label: 'Idea Gen', icon: Zap, color: 'from-yellow-400 to-orange-500', href: '/app/assist' },
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
    <div className="max-w-5xl mx-auto pb-24 md:pb-0">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Ready to create,
          </span>{' '}
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            Creator?
          </span>
        </h1>
        <p className="text-gray-400 text-lg">Your AI studio is ready. What are we making today?</p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link 
              to={action.href}
              className="group relative block aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="text-white" size={24} />
                </div>
                <span className="font-bold text-white">{action.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-gray-400" />
              Recent Projects
            </h2>
            <Link to="/app/create" className="text-sm text-orange-500 hover:text-orange-400">View All</Link>
          </div>
          
          <div className="space-y-3">
            {recentProjects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-900 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                  <project.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{project.title}</h3>
                  <p className="text-xs text-gray-500">{project.type} • {project.date}</p>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending Templates */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-gray-400" />
              Trending
            </h2>
          </div>

          <div className="space-y-3">
            {trendingTemplates.map((template, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="p-4 bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={40} />
                </div>
                <h3 className="font-bold text-white mb-1">{template.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 rounded-full bg-white/10">{template.category}</span>
                  <span>{template.plays} uses</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Assistant Teaser */}
          <div className="p-5 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-2xl mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-purple-200">AI Assistant</span>
            </div>
            <p className="text-sm text-purple-200/70 mb-3">
              "I can help you plan your content strategy for next week. Want to try?"
            </p>
            <Link 
              to="/app/assist"
              className="block w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-center rounded-lg text-sm font-medium transition-colors"
            >
              Chat Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
