import { useAppAuth, apiClient } from '../../lib/api';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { PLANS, PlanId } from '../../lib/plans';
import { cn } from '../../lib/utils';

export default function BillingPage() {
  const { getToken } = useAppAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await apiClient('/billing/paystack/initialize', {
        method: 'POST',
        body: JSON.stringify({ plan: planId })
      }, getToken);
      
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      }
    } catch (error) {
      console.error(error);
      alert('Failed to initialize payment');
    } finally {
      setLoading(null);
    }
  };

  const planList = [PLANS.FREE, PLANS.PRO, PLANS.CREATOR_PRO];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Simple, Transparent Pricing</h1>
        <p className="text-gray-400">Start for free, upgrade as you grow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {planList.map((plan) => (
          <div 
            key={plan.id}
            className={cn(
              "p-8 rounded-3xl border relative overflow-hidden flex flex-col transition-all hover:scale-[1.02]",
              plan.id === 'PRO' ? "bg-[#0A0E1A]/80 border-[#8B5CF6] shadow-[0_0_30px_rgba(139,92,246,0.2)]" : "bg-[#0A0E1A]/40 border-white/10"
            )}
          >
            {plan.id === 'PRO' && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-widest">
                POPULAR
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-400 text-sm">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-[#3B82F6] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            {plan.id === 'FREE' ? (
              <button className="w-full py-3 rounded-xl font-bold bg-white/5 text-gray-500 cursor-default border border-white/5">
                Current Plan
              </button>
            ) : (
              <button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={!!loading}
                className={cn(
                  "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg",
                  plan.id === 'PRO' 
                    ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90" 
                    : "bg-white text-black hover:bg-gray-200"
                )}
              >
                {loading === plan.id ? <Loader2 className="animate-spin" /> : `Upgrade to ${plan.name}`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
