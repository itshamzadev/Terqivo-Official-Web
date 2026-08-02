import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  general: {
    companyName: { type: String, default: 'Terqivo' },
    companyTagline: { type: String, default: 'Building intelligent software, AI-powered products, and secure digital systems.' },
    companyDescription: { type: String, default: 'Terqivo builds intelligent software, AI-powered products, and secure digital systems.' },
    companyType: { type: String, default: 'Remote-First Company' },
    portfolioUrl: { type: String, default: 'https://itshamzadev.com' },
  },
  contact: {
    email: { type: String, default: 'hello@terqivo.com' },
    phone: { type: String, default: '+92 370 812 1767' },
    locationLabel: { type: String, default: 'Remote-First Company' },
    locationDescription: { type: String, default: 'Serving clients worldwide.' },
  },
  announcement: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: 'Building intelligent software, AI-powered products, and secure digital systems.' },
    linkLabel: { type: String, default: 'Learn more →' },
    linkUrl: { type: String, default: '/services' },
    openInNewTab: { type: Boolean, default: false },
  },
  branding: {
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
  },
  seo: {
    defaultTitle: { type: String, default: 'Terqivo — AI, Software and Intelligent Digital Products' },
    defaultDescription: { type: String, default: 'Terqivo builds AI-powered products, modern software platforms, business automation systems, and secure digital solutions.' },
    ogImageUrl: { type: String, default: '' },
  },
  footer: {
    description: { type: String, default: 'Terqivo builds intelligent software, AI-powered products, and secure digital systems.' },
    copyrightText: { type: String, default: '© 2026 Terqivo. All rights reserved.' },
  },
  social: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  courseContact: {
    courseWhatsAppEnabled: { type: Boolean, default: false },
    courseWhatsAppNumber: { type: String, default: '' },
    courseWhatsAppMessage: { type: String, default: 'Hello Terqivo, I want details about the {courseTitle} course.' },
  }
}, {
  timestamps: true,
});

siteSettingsSchema.statics.getSettings = async function() {
  if (mongoose.connection.readyState !== 1) {
    console.warn("DB disconnected, returning default settings");
    return new this({});
  }
  
  try {
    let settings = await this.findOne();
    if (!settings) {
      settings = await this.create({});
    }
    return settings;
  } catch (error) {
    console.warn("Could not get settings from DB, returning defaults");
    return new this({});
  }
};

// Use type assertion since Mongoose statics typing can be tricky in older versions without custom interfaces
export const SiteSettings = mongoose.model<any, any>('SiteSettings', siteSettingsSchema);
