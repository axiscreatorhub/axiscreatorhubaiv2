import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppAuth } from '../../lib/api';
import { useAppUser } from '../../lib/user';
import { 
  Home,
  PlusCircle, 
  Edit3, 
  Bot, 
  Calendar, 
  DollarSign,
  LogOut, 
  Settings,
  Menu,
  X,
  Sparkles,
  FileText,
  User,
  RefreshCw,
  Send,
  ImageIcon,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAppAuth();
  const { user } = useAppUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/app', label: 'Home', icon: Home, exact: true },
    { href: '/app/create', label: 'Create', icon: PlusCircle },
    { href: '/app/scripts', label: 'Scripts', icon: FileText },
    { href: '/app/repurpose', label: 'Repurpose', icon: RefreshCw },
    { href: '/app/outreach', label: 'Outreach', icon: Send },
    { href: '/app/thumbnails', label: 'Thumbnails', icon: ImageIcon },
    { href: '/app/predict', label: 'Predict', icon: TrendingUp },
    { href: '/app/mediakit', label: 'Media Kit', icon: User },
    { href: '/app/assist', label: 'Assist', icon: Bot },
    { href: '/app/publish', label: 'Publish', icon: Calendar },
    { href: '/app/monetize', label: 'Monetize', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex font-sans selection:bg-[#8B5CF6]/30 overflow-hidden relative">
      
      {/* --- Animated Premium Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A0E1A] via-[#05070A] to-[#05070A]" />
        
        {/* Animated Orbs - New Suite Colors */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#8B5CF6]/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#EC4899]/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- Glass Sidebar (Desktop) --- */}
      <aside className="hidden md:flex fixed inset-y-4 left-4 z-50 w-20 lg:w-72 bg-[#0A0E1A]/40 backdrop-blur-3xl rounded-[2.5rem] flex-col transition-all duration-500 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] rounded-xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="relative w-12 h-12 bg-[#05070A] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles size={24} className="text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-3xl tracking-tighter hidden lg:block text-white">
            AXIS
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <item.icon 
                  size={20} 
                  className={cn(
                    "shrink-0 transition-all duration-500 relative z-10",
                    isActive ? "text-[#8B5CF6] scale-110 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" : "group-hover:text-white group-hover:scale-110"
                  )} 
                />
                <span className={cn(
                  "font-display font-bold hidden lg:block relative z-10 text-sm tracking-widest uppercase transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                )}>
                  {item.label}
                </span>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto">
          <div className="glass-card rounded-2xl p-3 flex items-center gap-3 cursor-pointer group hover:bg-white/5 transition-colors">
            <div className="relative">
              <img 
                src={user?.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#EC4899] rounded-full border-2 border-[#05070A]" />
            </div>
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-white group-hover:text-[#3B82F6] transition-colors">
                {user?.fullName || 'Creator'}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pro Plan</p>
            </div>
            <Settings size={16} className="text-gray-500 hidden lg:block group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* --- Mobile Header --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10 flex items-center justify-between px-4 bg-[#05070A]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AXIS</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 px-6"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <item.icon size={24} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-28 lg:ml-80 min-h-screen relative z-10 pt-20 md:pt-8 px-4 md:px-8 pb-10 overflow-x-hidden">
        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between mb-12">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter">
            {navItems.find(i => location.pathname === i.href || location.pathname.startsWith(i.href + '/'))?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-6">
            <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              Feedback
            </button>
            <div className="h-10 w-[1px] bg-white/10" />
            <button className="flex items-center gap-3 text-sm font-display font-bold text-gray-400 hover:text-white transition-colors">
              <Calendar size={18} className="text-[#8B5CF6]" />
              <span className="uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[1400px] mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
