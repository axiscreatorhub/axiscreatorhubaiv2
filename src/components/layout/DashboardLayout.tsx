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
  Sparkles
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
    { href: '/app/edit', label: 'Edit', icon: Edit3 },
    { href: '/app/assist', label: 'Assist', icon: Bot },
    { href: '/app/publish', label: 'Publish', icon: Calendar },
    { href: '/app/monetize', label: 'Monetize', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex font-sans selection:bg-[#E1306C]/30 overflow-hidden relative">
      
      {/* --- Animated Premium Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#000000] to-[#000000]" />
        
        {/* Animated Orbs - Instagram Colors */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#833AB4]/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#E1306C]/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-[#FCAF45]/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- Glass Sidebar (Desktop) --- */}
      <aside className="hidden md:flex fixed inset-y-4 left-4 z-50 w-20 lg:w-72 glass-panel rounded-3xl flex-col transition-all duration-300 border border-white/10 shadow-2xl">
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4] rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-10 h-10 bg-[#000000] border border-white/10 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
          </div>
          <span className="font-bold text-2xl tracking-tight hidden lg:block text-white">
            AXIS
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-[#E1306C]/20 to-transparent opacity-50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <item.icon 
                  size={22} 
                  className={cn(
                    "shrink-0 transition-colors relative z-10",
                    isActive ? "text-[#E1306C] drop-shadow-[0_0_8px_rgba(225,48,108,0.5)]" : "group-hover:text-white"
                  )} 
                />
                <span className="font-medium hidden lg:block relative z-10 text-sm tracking-wide">{item.label}</span>
                
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
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#E1306C] rounded-full border-2 border-[#000000]" />
            </div>
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-white group-hover:text-[#FCAF45] transition-colors">
                {user?.fullName || 'Creator'}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pro Plan</p>
            </div>
            <Settings size={16} className="text-gray-500 hidden lg:block group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* --- Mobile Header --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10 flex items-center justify-between px-4 bg-[#000000]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4] rounded-lg flex items-center justify-center">
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
        <div className="hidden md:flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white/90">
            {navItems.find(i => location.pathname === i.href || location.pathname.startsWith(i.href + '/'))?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-full glass-card text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
              Feedback
            </button>
            <div className="h-8 w-[1px] bg-white/10" />
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
