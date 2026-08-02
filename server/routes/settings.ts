import { Router } from 'express';
import { SiteSettings } from '../models/SiteSettings';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET public settings (no auth required)
router.get('/public', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    
    // Return only safe public fields
    res.json({
      success: true,
      data: {
        general: settings.general,
        contact: settings.contact,
        announcement: settings.announcement,
        branding: settings.branding,
        seo: settings.seo,
        footer: settings.footer,
        social: settings.social,
        courseContact: settings.courseContact
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch public settings', error: error.message });
  }
});

// GET admin settings (auth required)
router.get('/', authenticate, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
});

// PUT admin settings (auth required)
router.put('/', authenticate, async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    
    // Update fields if provided
    if (req.body.general) settings.general = { ...settings.general, ...req.body.general };
    if (req.body.contact) settings.contact = { ...settings.contact, ...req.body.contact };
    if (req.body.announcement) settings.announcement = { ...settings.announcement, ...req.body.announcement };
    if (req.body.branding) settings.branding = { ...settings.branding, ...req.body.branding };
    if (req.body.seo) settings.seo = { ...settings.seo, ...req.body.seo };
    if (req.body.footer) settings.footer = { ...settings.footer, ...req.body.footer };
    if (req.body.social) settings.social = { ...settings.social, ...req.body.social };
    if (req.body.courseContact) settings.courseContact = { ...settings.courseContact, ...req.body.courseContact };

    await settings.save();
    
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
});

export default router;
