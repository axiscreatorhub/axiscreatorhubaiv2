import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export default function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#0A0E1A] border border-[#8B5CF6]/30 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#8B5CF6]">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upgrade to Unlock</h2>
            <p className="text-gray-400 text-sm">
              The <span className="text-white font-medium">{feature}</span> feature is available on the Pro plan.
            </p>
          </div>

          <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">Pro Plan</span>
              <span className="text-[#8B5CF6] font-bold">$19/mo</span>
            </div>
            <ul className="space-y-2">
              {['Unlimited Hooks', '50 AI Assets/mo', 'Priority Support'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={14} className="text-[#3B82F6]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/app/billing"
            className="block w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold text-center rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            View Plans
          </Link>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
