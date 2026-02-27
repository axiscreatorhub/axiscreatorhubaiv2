import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Globe, 
  Link as LinkIcon, 
  User, 
  Save, 
  ExternalLink, 
  Eye,
  Instagram,
  Youtube,
  Twitter,
  Plus,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react';
import { apiClient, useAppAuth } from '../../lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MediaKitPage() {
  const { getToken } = useAppAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<any>({
    slug: '',
    bio: '',
    links: [],
    stats: {},
    mediaKit: { theme: 'MODERN', isPublic: false }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiClient('/mediakit', {}, getToken);
      if (res) {
        setData({
          ...res,
          links: res.links ? JSON.parse(res.links) : [],
          stats: res.stats ? JSON.parse(res.stats) : {},
          mediaKit: res.mediaKit || { theme: 'MODERN', isPublic: false }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient('/mediakit', {
        method: 'PATCH',
        body: JSON.stringify({
          slug: data.slug,
          bio: data.bio,
          referenceContent: data.referenceContent,
          links: data.links,
          stats: data.stats,
          theme: data.mediaKit.theme,
          isPublic: data.mediaKit.isPublic
        })
      }, getToken);
      alert('Media Kit updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update Media Kit');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('mediakit-preview');
    if (!element) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#05070A'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.slug || 'mediakit'}-axis-profile.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const addLink = () => {
    setData({ ...data, links: [...data.links, { platform: 'Instagram', url: '' }] });
  };

  const removeLink = (index: number) => {
    const newLinks = [...data.links];
    newLinks.splice(index, 1);
    setData({ ...data, links: newLinks });
  };

  if (loading) return <div className="flex items-center justify-center py-20 animate-pulse">Loading Media Kit...</div>;

  const publicUrl = `${window.location.origin}/m/${data.slug}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Media Kit Architect</h1>
          <p className="text-gray-400">Your professional portfolio for brand deals.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            {exporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
            Export PDF
          </button>
          {data.slug && data.mediaKit.isPublic && (
            <a 
              href={publicUrl} 
              target="_blank" 
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <Eye size={16} /> View Public
            </a>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 btn-viral rounded-xl text-sm font-bold flex items-center gap-2"
          >
            {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Configuration */}
        <div className="lg:col-span-7 space-y-8">
          {/* Public Settings */}
          <div className="glass-card rounded-[2.5rem] p-8 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Globe size={20} className="text-[#3B82F6]" />
              Public Identity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Custom URL Slug</label>
                <div className="flex items-center">
                  <span className="bg-white/5 border border-r-0 border-white/10 px-3 py-3 rounded-l-xl text-gray-500 text-sm">/m/</span>
                  <input 
                    type="text" 
                    value={data.slug || ''}
                    onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="your-username"
                    className="flex-1 bg-black border border-white/10 rounded-r-xl px-4 py-3 text-sm focus:border-[#8B5CF6] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Visibility</label>
                <button 
                  onClick={() => setData({ ...data, mediaKit: { ...data.mediaKit, isPublic: !data.mediaKit.isPublic } })}
                  className={`w-full py-3 rounded-xl border font-bold text-sm transition-all ${
                    data.mediaKit.isPublic ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
                  }`}
                >
                  {data.mediaKit.isPublic ? 'Publicly Visible' : 'Private / Draft'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Professional Bio</label>
              <textarea 
                value={data.bio || ''}
                onChange={(e) => setData({ ...data, bio: e.target.value })}
                placeholder="Tell brands who you are and why they should work with you..."
                className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-sm focus:border-[#8B5CF6] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">AI Brand Clone (Reference Content)</label>
              <p className="text-[10px] text-gray-500 mb-2">Paste 3-5 of your best scripts or captions here. AXIS will learn your unique voice and vocabulary.</p>
              <textarea 
                value={data.referenceContent || ''}
                onChange={(e) => setData({ ...data, referenceContent: e.target.value })}
                placeholder="Paste your past successful content here..."
                className="w-full h-48 bg-black border border-white/10 rounded-2xl p-4 text-sm focus:border-[#8B5CF6] outline-none resize-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <LinkIcon size={20} className="text-[#EC4899]" />
                Social Ecosystem
              </h2>
              <button onClick={addLink} className="p-2 bg-[#EC4899]/10 text-[#EC4899] rounded-lg hover:bg-[#EC4899]/20 transition-all">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {data.links.map((link: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <select 
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...data.links];
                      newLinks[i].platform = e.target.value;
                      setData({ ...data, links: newLinks });
                    }}
                    className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#8B5CF6] outline-none"
                  >
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Twitter</option>
                    <option>LinkedIn</option>
                  </select>
                  <input 
                    type="text" 
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...data.links];
                      newLinks[i].url = e.target.value;
                      setData({ ...data, links: newLinks });
                    }}
                    placeholder="URL"
                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#8B5CF6] outline-none"
                  />
                  <button onClick={() => removeLink(i)} className="p-3 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview & Stats */}
        <div className="lg:col-span-5 space-y-8">
          {/* LIVE PREVIEW (Target for PDF) */}
          <div className="sticky top-8 space-y-8">
            <div className="glass-card rounded-[2.5rem] overflow-hidden border-[#8B5CF6]/20">
              <div className="p-4 bg-[#8B5CF6]/10 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest">Live Preview</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              
              <div id="mediakit-preview" className="p-8 bg-[#05070A] min-h-[400px]">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                    {data.slug?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <h3 className="text-2xl font-display font-bold">@{data.slug || 'username'}</h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    {data.bio || 'Your professional bio will appear here...'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {Object.entries(data.stats).map(([label, value]: [string, any]) => (
                    <div key={label} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <div className="text-xs font-bold text-white">{value || '0'}</div>
                      <div className="text-[8px] text-gray-500 uppercase tracking-tighter">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {data.links.map((link: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold">{link.platform}</span>
                      <ExternalLink size={12} className="text-gray-600" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 pt-6 border-t border-white/5 text-center">
                  <div className="text-[8px] text-gray-600 uppercase tracking-widest">Verified by AXIS AI</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <BarChart3 size={20} className="text-[#8B5CF6]" />
                Key Stats
              </h2>
              <div className="space-y-4">
                {['Followers', 'Engagement', 'Monthly Views'].map((stat) => (
                  <div key={stat}>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat}</label>
                    <input 
                      type="text" 
                      value={data.stats[stat] || ''}
                      onChange={(e) => setData({ ...data, stats: { ...data.stats, [stat]: e.target.value } })}
                      placeholder="e.g. 150k"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#8B5CF6] outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
