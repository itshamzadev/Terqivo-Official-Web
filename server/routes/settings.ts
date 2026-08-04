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
        courseContact: settings.courseContact,
        jobContact: settings.jobContact,
        userAccess: settings.userAccess,
        email: {
          companyName: settings.email?.companyName,
          websiteUrl: settings.email?.websiteUrl,
          supportPhone: settings.email?.supportPhone,
          supportWhatsApp: settings.email?.supportWhatsApp,
        }
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

// PUT/PATCH admin settings (auth required)
const updateSettings = async (req: any, res: any) => {
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
    if (req.body.jobContact) settings.jobContact = { ...settings.jobContact, ...req.body.jobContact };
    if (req.body.userAccess) settings.userAccess = { ...settings.userAccess, ...req.body.userAccess };
    if (req.body.email) {
      const allowed = ['emailEnabled', 'senderName', 'senderEmail', 'replyToEmail', 'adminNotificationEmail', 'companyName', 'companyLogo', 'websiteUrl', 'supportPhone', 'supportWhatsApp', 'emailFooterText', 'emailSignature', 'sendAdminNotifications', 'sendApplicantConfirmations', 'sendCourseEnrollmentEmails', 'sendJobApplicationEmails', 'sendContactFormEmails', 'sendPaymentStatusEmails'];
      const safeEmail = Object.fromEntries(Object.entries(req.body.email).filter(([key]) => allowed.includes(key)));
      settings.email = { ...settings.email, ...safeEmail };
    }

    await settings.save();
    
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

router.put('/', authenticate, updateSettings);
router.patch('/', authenticate, updateSettings);

export default router;
