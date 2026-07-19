import express from 'express';
import { Service, Product, Course, Job, BlogPost, ContactMessage } from '../models';

const router = express.Router();

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/services/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, status: 'active' });
    if (!service) return res.status(404).json({ error: 'Not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: { $ne: 'deprecated' } }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/courses/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, status: 'active' });
    if (!course) return res.status(404).json({ error: 'Not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newMsg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.post('/enroll', async (req, res) => {
  try {
    const { courseId, name, email, phone, education, message } = req.body;
    const { Enrollment } = await import('../models/Enrollment');
    const newEnrollment = await Enrollment.create({ courseId, name, email, phone, education, message });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit enrollment' });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/jobs/:slug', async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug, status: 'open' });
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/page/:slug', async (req, res) => {
  try {
    const { PageContent } = await import('../models/PageContent');
    const page = await PageContent.findOne({ page: req.params.slug });
    if (!page) return res.status(404).json({ error: 'Not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/job-apply', async (req, res) => {
  try {
    const { jobId, name, email, phone, cvUrl, coverLetter } = req.body;
    const { JobApplication } = await import('../models/JobApplication');
    await JobApplication.create({ jobId, name, email, phone, cvUrl, coverLetter });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/settings/:key', async (req, res) => {
  try {
    const { SiteSettings } = await import('../models/SiteSettings');
    const item = await SiteSettings.findOne({ key: req.params.key });
    res.json(item ? item.value : {});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
