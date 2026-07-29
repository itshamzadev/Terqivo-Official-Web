import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Save, Globe, Settings, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [general, setGeneral] = useState({
    companyName: 'TERQIVO',
    tagline: 'Builds for Generations',
    description: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    twitterUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    logoUrl: '',
    footerText: ''
  });

  const [seo, setSeo] = useState({
    defaultTitle: 'TERQIVO - Builds for Generations',
    defaultDescription: 'Premium technology and software company.',
    keywords: 'software, ai, technology',
    ogImageUrl: '',
    canonicalBaseUrl: 'https://terqivo.com'
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const resGen = await apiFetch('/api/admin/settings/general');
      if (resGen.ok) {
        const data = await resGen.json();
        if (Object.keys(data).length > 0) setGeneral(data);
      }
      
      const resSeo = await apiFetch('/api/admin/settings/seo');
      if (resSeo.ok) {
        const data = await resSeo.json();
        if (Object.keys(data).length > 0) setSeo(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (key: string, data: any) => {
    setSaving(true);
    try {
      await apiFetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      alert('Settings saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Website Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global platform properties and SEO defaults.</p>
      </div>
      
      <div className="space-y-8">
        {/* General Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-border/60 flex items-center gap-4 bg-secondary/10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">General Settings</h2>
              <p className="text-sm text-muted-foreground">Basic company information and branding.</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Company Name</label>
                <input value={general.companyName} onChange={e => setGeneral({...general, companyName: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Tagline</label>
                <input value={general.tagline} onChange={e => setGeneral({...general, tagline: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
            </div>
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Company Description</label>
              <textarea rows={3} value={general.description} onChange={e => setGeneral({...general, description: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground" />
            </div>
            
            <div className="h-px w-full bg-border/50 my-6" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Email</label>
                <input value={general.email} onChange={e => setGeneral({...general, email: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Phone</label>
                <input value={general.phone} onChange={e => setGeneral({...general, phone: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">WhatsApp</label>
                <input value={general.whatsapp} onChange={e => setGeneral({...general, whatsapp: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
            </div>
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Address</label>
              <input value={general.address} onChange={e => setGeneral({...general, address: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
            </div>
            
            <div className="h-px w-full bg-border/50 my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">LinkedIn URL</label>
                <input value={general.linkedinUrl} onChange={e => setGeneral({...general, linkedinUrl: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Twitter URL</label>
                <input value={general.twitterUrl} onChange={e => setGeneral({...general, twitterUrl: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Logo URL</label>
                <input value={general.logoUrl} onChange={e => setGeneral({...general, logoUrl: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Footer Text</label>
                <input value={general.footerText} onChange={e => setGeneral({...general, footerText: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
            </div>
            <div className="pt-6 flex justify-end border-t border-border/50">
              <button 
                onClick={() => handleSave('general', general)}
                disabled={saving}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save General Settings'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* SEO Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-border/60 flex items-center gap-4 bg-secondary/10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">SEO Settings</h2>
              <p className="text-sm text-muted-foreground">Search engine optimization defaults.</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Default Title</label>
              <input value={seo.defaultTitle} onChange={e => setSeo({...seo, defaultTitle: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
            </div>
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Default Description</label>
              <textarea rows={3} value={seo.defaultDescription} onChange={e => setSeo({...seo, defaultDescription: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground" />
            </div>
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Keywords</label>
              <input value={seo.keywords} onChange={e => setSeo({...seo, keywords: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="Comma separated keywords" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Open Graph Image URL</label>
                <input value={seo.ogImageUrl} onChange={e => setSeo({...seo, ogImageUrl: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Canonical Base URL</label>
                <input value={seo.canonicalBaseUrl} onChange={e => setSeo({...seo, canonicalBaseUrl: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
              </div>
            </div>
            <div className="pt-6 flex justify-end border-t border-border/50">
              <button 
                onClick={() => handleSave('seo', seo)}
                disabled={saving}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
