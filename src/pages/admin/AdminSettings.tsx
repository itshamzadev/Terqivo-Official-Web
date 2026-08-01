import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Settings, 
  Globe, 
  Megaphone, 
  Image as ImageIcon, 
  Search, 
  Layout, 
  Share2,
  Server,
  RefreshCw,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // States for form fields
  const [general, setGeneral] = useState({
    companyName: '', companyTagline: '', companyDescription: '', companyType: '', portfolioUrl: ''
  });
  const [contact, setContact] = useState({
    email: '', phone: '', locationLabel: '', locationDescription: ''
  });
  const [announcement, setAnnouncement] = useState({
    enabled: true, text: '', linkLabel: '', linkUrl: '', openInNewTab: false
  });
  const [branding, setBranding] = useState({
    logoUrl: '', faviconUrl: ''
  });
  const [seo, setSeo] = useState({
    defaultTitle: '', defaultDescription: '', ogImageUrl: ''
  });
  const [footer, setFooter] = useState({
    description: '', copyrightText: ''
  });
  const [social, setSocial] = useState({
    linkedin: '', github: '', youtube: '', twitter: '', facebook: '', instagram: ''
  });

  const [systemInfo, setSystemInfo] = useState({
    environment: 'production',
    backendStatus: 'connected',
    dbStatus: 'connected',
    clientVersion: '1.0.0',
    lastUpdated: ''
  });

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const json = await res.json();
      const data = json.data;
      if (data) {
        setSettings(data);
        if (data.general) setGeneral(data.general);
        if (data.contact) setContact(data.contact);
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.branding) setBranding(data.branding);
        if (data.seo) setSeo(data.seo);
        if (data.footer) setFooter(data.footer);
        if (data.social) setSocial(data.social);
        if (data.updatedAt) setSystemInfo(prev => ({ ...prev, lastUpdated: new Date(data.updatedAt).toLocaleString() }));
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Failed to fetch health');
      const health = await res.json();
      setSystemInfo(prev => ({
        ...prev,
        backendStatus: health?.status || 'unknown',
        dbStatus: health?.db || 'unknown'
      }));
      toast.success('System status refreshed');
    } catch (error) {
      setSystemInfo(prev => ({
        ...prev,
        backendStatus: 'disconnected',
        dbStatus: 'disconnected'
      }));
      toast.error('Failed to reach backend');
    }
  };

  useEffect(() => {
    fetchSettings();
    checkSystemStatus();
  }, []);

  const handleSave = async (section: string, payload: any) => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [section]: payload })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Generic handler for input changes
  const handleChange = (section: string, setter: React.Dispatch<React.SetStateAction<any>>, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setter((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileUpload = async (section: string, field: string, setter: React.Dispatch<React.SetStateAction<any>>, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const loadingToast = toast.loading('Uploading...');
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await res.json();
      toast.dismiss(loadingToast);
      
      if (result.success && result.data?.url) {
        setter((prev: any) => ({
          ...prev,
          [field]: result.data.url
        }));
        toast.success('File uploaded successfully');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error uploading file');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'contact', label: 'Contact', icon: Globe },
    { id: 'announcement', label: 'Announcement', icon: Megaphone },
    { id: 'branding', label: 'Branding', icon: ImageIcon },
    { id: 'seo', label: 'SEO Defaults', icon: Search },
    { id: 'footer', label: 'Footer', icon: Layout },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'system', label: 'System Info', icon: Server },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global configuration for your Terqivo platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <nav className="flex flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-2 border-primary-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Basic details about the company.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input type="text" name="companyName" value={general.companyName} onChange={(e) => handleChange('general', setGeneral, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Type</label>
                    <input type="text" name="companyType" value={general.companyType} onChange={(e) => handleChange('general', setGeneral, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Tagline</label>
                    <input type="text" name="companyTagline" value={general.companyTagline} onChange={(e) => handleChange('general', setGeneral, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Description</label>
                    <textarea name="companyDescription" rows={3} value={general.companyDescription} onChange={(e) => handleChange('general', setGeneral, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfolio URL</label>
                    <input type="url" name="portfolioUrl" value={general.portfolioUrl} onChange={(e) => handleChange('general', setGeneral, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('general', general)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Public contact details displayed on the website.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
                    <input type="email" name="email" value={contact.email} onChange={(e) => handleChange('contact', setContact, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp</label>
                    <input type="text" name="phone" value={contact.phone} onChange={(e) => handleChange('contact', setContact, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location Label</label>
                    <input type="text" name="locationLabel" value={contact.locationLabel} onChange={(e) => handleChange('contact', setContact, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location Description</label>
                    <input type="text" name="locationDescription" value={contact.locationDescription} onChange={(e) => handleChange('contact', setContact, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('contact', contact)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Announcement Bar Settings */}
            {activeTab === 'announcement' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Announcement Bar</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage the global banner displayed at the top of the public website.</p>
                </div>

                {/* Live Preview */}
                {announcement.enabled && (
                  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wider">Live Preview</p>
                    <div className="bg-primary-600 text-white px-4 py-2 rounded text-sm text-center flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="truncate">{announcement.text || 'No text set'}</span>
                      {announcement.linkLabel && (
                        <a href={announcement.linkUrl || '#'} className="font-semibold underline underline-offset-2 whitespace-nowrap" onClick={e => e.preventDefault()}>
                          {announcement.linkLabel}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input 
                      type="checkbox" 
                      id="enabled" 
                      name="enabled" 
                      checked={announcement.enabled} 
                      onChange={(e) => handleChange('announcement', setAnnouncement, e)} 
                      className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" 
                    />
                    <div>
                      <label htmlFor="enabled" className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">Enable Announcement Bar</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Toggle the visibility of the banner across the site.</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Announcement Text</label>
                    <input type="text" name="text" value={announcement.text} onChange={(e) => handleChange('announcement', setAnnouncement, e)} disabled={!announcement.enabled} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Label</label>
                    <input type="text" name="linkLabel" value={announcement.linkLabel} onChange={(e) => handleChange('announcement', setAnnouncement, e)} disabled={!announcement.enabled} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link URL</label>
                    <input type="text" name="linkUrl" value={announcement.linkUrl} onChange={(e) => handleChange('announcement', setAnnouncement, e)} disabled={!announcement.enabled} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50" />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="openInNewTab" 
                      name="openInNewTab" 
                      checked={announcement.openInNewTab} 
                      onChange={(e) => handleChange('announcement', setAnnouncement, e)} 
                      disabled={!announcement.enabled}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 disabled:opacity-50" 
                    />
                    <label htmlFor="openInNewTab" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Open link in a new tab</label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('announcement', announcement)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Branding Settings */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Branding Assets</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage logos and site icons.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Logo</label>
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      {branding.logoUrl ? (
                        <div className="mb-4 relative w-full flex justify-center bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
                          <img src={branding.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                        </div>
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      )}
                      
                      <div className="flex flex-col w-full gap-2">
                        <label className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Logo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('branding', 'logoUrl', setBranding, e)} />
                        </label>
                        <input 
                          type="text" 
                          placeholder="Or paste URL here..." 
                          name="logoUrl" 
                          value={branding.logoUrl} 
                          onChange={(e) => handleChange('branding', setBranding, e)} 
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">SVG or high-res PNG recommended. Max size: 2MB.</p>
                    </div>
                  </div>

                  {/* Favicon Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Favicon</label>
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      {branding.faviconUrl ? (
                        <div className="mb-4 w-12 h-12 bg-white rounded-lg shadow flex items-center justify-center overflow-hidden p-1">
                          <img src={branding.faviconUrl} alt="Favicon Preview" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <Globe className="w-12 h-12 text-gray-400 mb-3" />
                      )}
                      
                      <div className="flex flex-col w-full gap-2">
                        <label className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Favicon
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('branding', 'faviconUrl', setBranding, e)} />
                        </label>
                        <input 
                          type="text" 
                          placeholder="Or paste URL here..." 
                          name="faviconUrl" 
                          value={branding.faviconUrl} 
                          onChange={(e) => handleChange('branding', setBranding, e)} 
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">Square image (16x16, 32x32, or .ico format)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('branding', branding)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Defaults</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Global metadata used when page-specific SEO isn't set.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default SEO Title</label>
                      <span className="text-xs text-gray-500">{seo.defaultTitle.length}/60 chars recommended</span>
                    </div>
                    <input type="text" name="defaultTitle" value={seo.defaultTitle} onChange={(e) => handleChange('seo', setSeo, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Meta Description</label>
                      <span className="text-xs text-gray-500">{seo.defaultDescription.length}/160 chars recommended</span>
                    </div>
                    <textarea name="defaultDescription" rows={3} value={seo.defaultDescription} onChange={(e) => handleChange('seo', setSeo, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Open Graph Image</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {seo.ogImageUrl && (
                        <div className="w-full sm:w-48 aspect-[1.9/1] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                          <img src={seo.ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col w-full gap-2">
                        <label className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload OG Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('seo', 'ogImageUrl', setSeo, e)} />
                        </label>
                        <input 
                          type="text" 
                          placeholder="Or paste URL here..." 
                          name="ogImageUrl" 
                          value={seo.ogImageUrl} 
                          onChange={(e) => handleChange('seo', setSeo, e)} 
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                        />
                        <p className="text-xs text-gray-500">Recommended size: 1200 x 630 pixels.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('seo', seo)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Footer Settings */}
            {activeTab === 'footer' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Footer Content</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage the global footer content.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Footer Description</label>
                    <textarea name="description" rows={3} value={footer.description} onChange={(e) => handleChange('footer', setFooter, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Copyright Text</label>
                    <input type="text" name="copyrightText" value={footer.copyrightText} onChange={(e) => handleChange('footer', setFooter, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('footer', footer)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Social Links */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect your official social media profiles. Leave empty to hide the icon.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                    <input type="url" name="linkedin" value={social.linkedin} onChange={(e) => handleChange('social', setSocial, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                    <input type="url" name="github" value={social.github} onChange={(e) => handleChange('social', setSocial, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter / X URL</label>
                    <input type="url" name="twitter" value={social.twitter} onChange={(e) => handleChange('social', setSocial, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube URL</label>
                    <input type="url" name="youtube" value={social.youtube} onChange={(e) => handleChange('social', setSocial, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
                    <input type="url" name="facebook" value={social.facebook} onChange={(e) => handleChange('social', setSocial, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                    <input type="url" name="instagram" value={social.instagram} onChange={(e) => handleChange('social', setSocial, e)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleSave('social', social)} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* System Info */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current platform status and diagnostics.</p>
                  </div>
                  <button onClick={checkSystemStatus} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh Status
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Environment</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{systemInfo.environment}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">API Connection</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${systemInfo.backendStatus === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{systemInfo.backendStatus}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Database Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${systemInfo.dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{systemInfo.dbStatus}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Settings Update</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{systemInfo.lastUpdated || 'Never'}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
