import { useAppAuth, apiClient } from '../../lib/api';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function BillingPage() {
  const { getToken } = useAppAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    setLoading(plan);
    try {
      const res = await apiClient('/billing/paystack/initialize', {
        method: 'POST',
        body: JSON.stringify({ plan })
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-400">Start for free, upgrade as you grow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl bg-black border border-white/10">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold">$0</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['1 Brand Profile', '5 Hook Batches/day', 'Community Support'].map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <Check size={16} className="text-orange-500" />
                {feat}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-lg font-medium bg-white/10 text-white cursor-default">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-2xl bg-zinc-900 border border-orange-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <h3 className="text-xl font-bold mb-2">Pro</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold">$19</span>
            <span className="text-gray-400 text-sm">/mo</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Unlimited Hooks', '50 AI Assets/mo', 'Priority Support', 'Advanced Analytics'].map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <Check size={16} className="text-orange-500" />
                {feat}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => handleUpgrade('PRO')}
            disabled={!!loading}
            className="w-full py-3 rounded-lg font-medium bg-orange-500 text-black hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
          >
            {loading === 'PRO' ? <Loader2 className="animate-spin" /> : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Business Plan */}
        <div className="p-8 rounded-2xl bg-black border border-white/10">
          <h3 className="text-xl font-bold mb-2">Business</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold">$49</span>
            <span className="text-gray-400 text-sm">/mo</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['5 Brand Profiles', 'Unlimited Everything', 'Team Access', 'API Access'].map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <Check size={16} className="text-orange-500" />
                {feat}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => handleUpgrade('BUSINESS')}
            disabled={!!loading}
            className="w-full py-3 rounded-lg font-medium bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading === 'BUSINESS' ? <Loader2 className="animate-spin" /> : 'Contact Sales'}
          </button>
        </div>
      </div>
    </div>
  );
}
