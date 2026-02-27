import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mail, 
  Building2, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  ChevronRight,
  Target,
  BarChart3,
  FileText
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';

export default function OutreachPage() {
  const { getToken } = useAppAuth();
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorDescription, setSponsorDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractTerms, setContractTerms] = useState({ fee: '', deliverables: '', timeline: '' });
  const [contract, setContract] = useState<{ title: string; content: string } | null>(null);
  const [contractLoading, setContractLoading] = useState(false);

  const handleGeneratePitch = async () => {
    if (!sponsorName || !sponsorDescription) return;
    setLoading(true);
    try {
      const data = await apiClient('/ai/pitch', {
        method: 'POST',
        body: JSON.stringify({ sponsorName, sponsorDescription })
      }, getToken);
      setPitch(data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate pitch');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContract = async () => {
    if (!sponsorName || !contractTerms.fee) return;
    setContractLoading(true);
    try {
      const data = await apiClient('/ai/generate-contract', {
        method: 'POST',
        body: JSON.stringify({ sponsorName, terms: contractTerms })
      }, getToken);
      setContract(data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate contract');
    } finally {
      setContractLoading(false);
    }
  };

  const handleCopy = () => {
    if (!pitch) return;
    navigator.clipboard.writeText(`Subject: ${pitch.subject}\n\n${pitch.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">
          Sponsor <span className="text-gradient-viral">Outreach.</span>
        </h1>
        <p className="text-gray-400">AI-powered pitches backed by your real-time performance data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sponsor Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Nike, Adobe, NordVPN"
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#8B5CF6] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sponsor Context / Goal</label>
              <textarea 
                value={sponsorDescription}
                onChange={(e) => setSponsorDescription(e.target.value)}
                placeholder="What are they looking for? e.g. Launching a new fitness app, looking for Gen Z reach..."
                className="w-full h-48 bg-black border border-white/10 rounded-3xl p-6 text-sm focus:border-[#8B5CF6] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] shrink-0">
                <BarChart3 size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest mb-1">Data-Backed Pitch</p>
                <p className="text-xs text-gray-500 leading-relaxed">AXIS will automatically include your latest Media Kit views and engagement stats to prove your value.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGeneratePitch}
            disabled={loading || !sponsorName || !sponsorDescription}
            className="w-full py-5 btn-viral flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
            Generate Pro Pitch
          </button>

          <button
            onClick={() => setShowContractModal(true)}
            disabled={!sponsorName}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm font-bold text-gray-300"
          >
            <FileText size={18} /> Generate Contract Template
          </button>
        </div>

        {/* Output Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {pitch ? (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] p-8 md:p-12 min-h-[600px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    <Mail size={20} className="text-[#8B5CF6]" />
                    Email Draft
                  </h2>
                  <button 
                    onClick={handleCopy}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Subject Line</label>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white">
                    {pitch.subject}
                  </div>
                </div>

                <div className="flex-1 bg-black/40 rounded-3xl p-8 border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {pitch.body}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <Target size={40} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2 text-gray-400">Ready to Outreach</h2>
                <p className="text-gray-500 max-w-xs">Enter the sponsor details to generate a personalized, data-driven pitch email.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Contract Modal */}
      <AnimatePresence>
        {showContractModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContractModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card rounded-[2.5rem] p-8 md:p-12 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">Contract Architect</h2>
                <button onClick={() => setShowContractModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <RefreshCw size={24} className="rotate-45" />
                </button>
              </div>

              {!contract ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Deal Fee</label>
                      <input 
                        type="text"
                        value={contractTerms.fee}
                        onChange={(e) => setContractTerms({ ...contractTerms, fee: e.target.value })}
                        placeholder="e.g. $1,500 USD"
                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-[#8B5CF6] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Timeline</label>
                      <input 
                        type="text"
                        value={contractTerms.timeline}
                        onChange={(e) => setContractTerms({ ...contractTerms, timeline: e.target.value })}
                        placeholder="e.g. 2 weeks post-approval"
                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-[#8B5CF6] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Deliverables</label>
                    <textarea 
                      value={contractTerms.deliverables}
                      onChange={(e) => setContractTerms({ ...contractTerms, deliverables: e.target.value })}
                      placeholder="e.g. 1x 60s TikTok, 1x Instagram Story with link..."
                      className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-sm focus:border-[#8B5CF6] outline-none resize-none"
                    />
                  </div>
                  <button
                    onClick={handleGenerateContract}
                    disabled={contractLoading || !contractTerms.fee}
                    className="w-full py-4 btn-viral flex items-center justify-center gap-2 disabled:opacity-50 font-bold"
                  >
                    {contractLoading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
                    Generate Legal Draft
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-300 max-h-[400px] overflow-y-auto">
                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{contract.title}</h4>
                    {contract.content}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(contract.content);
                        alert('Contract copied to clipboard');
                      }}
                      className="flex-1 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                    >
                      Copy Contract
                    </button>
                    <button 
                      onClick={() => setContract(null)}
                      className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all text-gray-400"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
