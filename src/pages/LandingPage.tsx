import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-black">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">AXIS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/sign-in" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              to="/sign-up"
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-orange-400 mb-8"
          >
            <Sparkles size={12} />
            <span>AI-Powered Creator OS</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            Stop staring at a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              blank page.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Batch viral hooks, generate aesthetic assets, and scale your brand identity across Instagram, TikTok, and YouTube.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/sign-up"
              className="w-full sm:w-auto px-8 py-4 bg-orange-500 text-black font-bold rounded-full hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
            >
              Start Creating for Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              View Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 border-t border-white/5 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Viral Hooks",
                desc: "Generate 100+ scroll-stopping hooks in seconds based on your niche.",
                icon: "⚡"
              },
              {
                title: "Aesthetic Assets",
                desc: "Create on-brand thumbnails and stories that look professionally designed.",
                icon: "🎨"
              },
              {
                title: "Brand Identity",
                desc: "Store your tone, colors, and fonts so every output feels like you.",
                icon: "💎"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Start for free, upgrade as you grow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                features: ["1 Brand Profile", "5 Hook Batches/day", "5 Image Gens/day"],
                cta: "Get Started",
                highlight: false
              },
              {
                name: "Pro",
                price: "$19",
                period: "/mo",
                features: ["1 Brand Profile", "Unlimited Hooks", "50 Image Gens/day", "Priority Support"],
                cta: "Upgrade to Pro",
                highlight: true
              },
              {
                name: "Business",
                price: "$49",
                period: "/mo",
                features: ["5 Brand Profiles", "Unlimited Everything", "Team Access", "API Access"],
                cta: "Contact Sales",
                highlight: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl border ${
                  plan.highlight
                    ? "bg-zinc-900 border-orange-500 relative overflow-hidden"
                    : "bg-black border-white/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-orange-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? "bg-orange-500 text-black hover:bg-orange-400"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
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
