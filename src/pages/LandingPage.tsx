import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05070A] text-white font-sans selection:bg-[#8B5CF6] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#05070A]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
              <span className="font-bold text-white text-xl">A</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter">AXIS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link to="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/sign-in" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
            <Link
              to="/sign-up"
              className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#8B5CF6]/20 to-transparent blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-xs font-bold text-[#8B5CF6] mb-10 tracking-widest uppercase"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>The Engine of Viral Creation</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9] md:leading-[0.85]"
          >
            Transcend the <br />
            <span className="text-gradient-viral">
              Algorithm.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-accent font-light leading-relaxed"
          >
            AXIS is the world's first AI Operating System built exclusively for high-growth creators. Batch viral hooks, engineer aesthetic assets, and dominate every platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/sign-up"
              className="w-full sm:w-auto px-10 py-5 btn-viral text-lg flex items-center justify-center gap-3"
            >
              Claim Your Access
              <ArrowRight size={20} />
            </Link>
            <Link
              to="#features"
              className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Explore the OS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Engineered for Impact</h2>
            <p className="text-gray-500 font-accent">Ditch the generic. Build a brand that commands attention.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 glass-card rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl group-hover:bg-[#3B82F6]/20 transition-colors duration-500" />
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-3xl font-display font-bold mb-4">Viral Hook Engine</h3>
              <p className="text-gray-400 text-lg max-w-md">Generate 100+ scroll-stopping hooks in seconds. Powered by the same psychology used by the world's top 1% creators.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 glass-card rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/10 rounded-full blur-2xl group-hover:bg-[#EC4899]/20 transition-colors duration-500" />
              <div className="text-5xl mb-6">🎨</div>
              <h3 className="text-2xl font-display font-bold mb-4">Aesthetic Assets</h3>
              <p className="text-gray-400">Thumbnails and stories that look like they cost $5k to design.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 glass-card rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-2xl group-hover:bg-[#8B5CF6]/20 transition-colors duration-500" />
              <div className="text-5xl mb-6">💎</div>
              <h3 className="text-2xl font-display font-bold mb-4">Brand DNA</h3>
              <p className="text-gray-400">Store your tone, colors, and fonts. Every output feels like you.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 glass-card rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-3xl font-display font-bold mb-4">Multi-Platform Scale</h3>
              <p className="text-gray-400 text-lg max-w-md">One idea. Every platform. AXIS optimizes your content for TikTok, Reels, and Shorts automatically.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">The Investment in Your Growth</h2>
            <p className="text-gray-500 font-accent">Choose the engine that powers your creator journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "0",
                features: ["1 Brand Profile", "5 Hook Batches/day", "5 Image Gens/day"],
                cta: "Start for Free",
                highlight: false
              },
              {
                name: "Pro",
                price: "19",
                period: "/mo",
                features: ["1 Brand Profile", "Unlimited Hooks", "50 Image Gens/day", "Priority Support", "Custom Brand DNA"],
                cta: "Upgrade to Pro",
                highlight: true
              },
              {
                name: "Business",
                price: "49",
                period: "/mo",
                features: ["5 Brand Profiles", "Unlimited Everything", "Team Access", "API Access", "Dedicated Manager"],
                cta: "Contact Sales",
                highlight: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "p-10 rounded-3xl border transition-all duration-500 flex flex-col",
                  plan.highlight
                    ? "bg-[#0A0E1A]/80 border-[#8B5CF6] relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] scale-105 z-10"
                    : "bg-zinc-900/50 border-white/5 hover:border-white/20"
                )}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-widest uppercase">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-gray-400 text-2xl font-light">$</span>
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm font-accent">{plan.period}</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-5 h-5 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-[#3B82F6]" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all duration-300",
                    plan.highlight
                      ? "btn-viral"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AXIS Creator Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
