import express from 'express';
import { authenticate } from '../middlewares/auth';
import { Service, Product, Course, Job, BlogPost, ContactMessage } from '../models';

const router = express.Router();

router.use(authenticate as any);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const { Enrollment } = await import('../models/Enrollment');
    const { JobApplication } = await import('../models/JobApplication');
    
    const stats = {
      services: await Service.countDocuments(),
      products: await Product.countDocuments(),
      courses: await Course.countDocuments(),
      jobs: await Job.countDocuments({ status: 'open' }),
      blog: await BlogPost.countDocuments({ status: 'published' }),
      messages: await ContactMessage.countDocuments({ status: 'unread' }),
      enrollments: await Enrollment.countDocuments({ status: 'pending' }),
      applications: await JobApplication.countDocuments({ status: 'pending' })
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Services CRUD
router.get('/services', async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
});

router.post('/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Products CRUD
router.get('/products', async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/products', async (req, res) => {
  try {
    const item = await Product.create(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Courses CRUD
router.get('/courses', async (req, res) => {
  const items = await Course.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/courses', async (req, res) => {
  try {
    const item = await Course.create(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const item = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/courses/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Jobs CRUD
router.get('/jobs', async (req, res) => {
  const items = await Job.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/jobs', async (req, res) => {
  try {
    const item = await Job.create(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/jobs/:id', async (req, res) => {
  try {
    const item = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Blog CRUD
router.get('/blog', async (req, res) => {
  const items = await BlogPost.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/blog', async (req, res) => {
  try {
    const item = await BlogPost.create(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/blog/:id', async (req, res) => {
  try {
    const item = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/blog/:id', async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Messages
router.get('/messages', async (req, res) => {
  const items = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(items);
});

router.put('/messages/:id/status', async (req, res) => {
  try {
    const item = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Enrollments
router.get('/enrollments', async (req, res) => {
  const { Enrollment } = await import('../models/Enrollment');
  const items = await Enrollment.find().populate('courseId').sort({ createdAt: -1 });
  res.json(items);
});

router.put('/enrollments/:id/status', async (req, res) => {
  try {
    const { Enrollment } = await import('../models/Enrollment');
    const item = await Enrollment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/enrollments/:id', async (req, res) => {
  const { Enrollment } = await import('../models/Enrollment');
  await Enrollment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Job Applications
router.get('/job-applications', async (req, res) => {
  const { JobApplication } = await import('../models/JobApplication');
  const items = await JobApplication.find().populate('jobId').sort({ createdAt: -1 });
  res.json(items);
});

router.put('/job-applications/:id/status', async (req, res) => {
  try {
    const { JobApplication } = await import('../models/JobApplication');
    const item = await JobApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/job-applications/:id', async (req, res) => {
  const { JobApplication } = await import('../models/JobApplication');
  await JobApplication.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Pages
router.get('/pages', async (req, res) => {
  const { PageContent } = await import('../models/PageContent');
  const items = await PageContent.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post('/pages', async (req, res) => {
  try {
    const { PageContent } = await import('../models/PageContent');
    const item = await PageContent.create(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/pages/:id', async (req, res) => {
  try {
    const { PageContent } = await import('../models/PageContent');
    const item = await PageContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/pages/:id', async (req, res) => {
  const { PageContent } = await import('../models/PageContent');
  await PageContent.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Settings
router.get('/settings/:key', async (req, res) => {
  try {
    const { SiteSettings } = await import('../models/SiteSettings');
    const item = await SiteSettings.findOne({ key: req.params.key });
    res.json(item ? item.value : {});
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/settings/:key', async (req, res) => {
  try {
    const { SiteSettings } = await import('../models/SiteSettings');
    const item = await SiteSettings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body },
      { new: true, upsert: true }
    );
    res.json(item.value);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
