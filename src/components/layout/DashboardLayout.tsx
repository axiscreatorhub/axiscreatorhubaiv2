import React from 'react';
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
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAppAuth();
  const { user } = useAppUser();
  const location = useLocation();

  const navItems = [
    { href: '/app', label: 'Home', icon: Home, exact: true },
    { href: '/app/create', label: 'Create', icon: PlusCircle },
    { href: '/app/edit', label: 'Edit', icon: Edit3 },
    { href: '/app/assist', label: 'Assist', icon: Bot },
    { href: '/app/publish', label: 'Publish', icon: Calendar },
    { href: '/app/monetize', label: 'Monetize', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex font-sans selection:bg-orange-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-20 lg:w-64 bg-zinc-950 border-r border-white/5 flex-col transition-all duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <span className="font-bold text-black text-xl">A</span>
          </div>
          <span className="font-bold text-xl tracking-tight hidden lg:block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AXIS
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-white/10 text-white shadow-inner" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn(
                  "absolute left-0 w-1 h-8 rounded-r-full bg-orange-500 transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )} />
                <item.icon size={24} className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-orange-400" : "group-hover:text-white"
                )} />
                <span className="font-medium hidden lg:block">{item.label}</span>
                
                {/* Tooltip for tablet mode */}
                <div className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <img 
              src={user?.imageUrl} 
              alt={user?.fullName || 'User'} 
              className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 group-hover:border-orange-500/50 transition-colors"
            />
            <div className="flex-1 min-w-0 hidden lg:block">
              <p className="text-sm font-medium truncate text-white">{user?.fullName || 'Creator'}</p>
              <p className="text-xs text-gray-500 truncate">Pro Plan</p>
            </div>
            <Settings size={18} className="text-gray-500 hidden lg:block group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[64px]",
                  isActive ? "text-orange-500" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-orange-500/10" : "bg-transparent"
                )}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-20 lg:ml-64 min-h-screen relative overflow-x-hidden">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 p-6 md:p-10 pt-8 md:pt-10 pb-24 md:pb-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
