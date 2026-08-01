import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to write file
const write = (file, content) => {
  fs.writeFileSync(path.join(__dirname, 'server', 'routes', file), content.trim() + '\n', 'utf8');
};

// 1. auth.ts
const authContent = `
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ success: true, message: 'Login successful', data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await AdminUser.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
`;
write('auth.ts', authContent);

// Factory for CRUD routes
const crudFactory = (modelName, modelFile) => `
import { Router } from 'express';
import { ${modelName} } from '../models/${modelFile}';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all (public/admin)
router.get('/', async (req, res) => {
  try {
    const items = await ${modelName}.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let item;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      item = await ${modelName}.findById(idOrSlug);
    } else {
      item = await ${modelName}.findOne({ slug: idOrSlug });
    }
    
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create
router.post('/', authenticate, async (req, res) => {
  try {
    const item = new ${modelName}(req.body);
    await item.save();
    res.status(201).json({ success: true, message: 'Created successfully', data: item });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }
    res.status(400).json({ success: false, message: 'Bad request', error: error.message });
  }
});

// Update
router.put('/:id', authenticate, async (req, res) => {
  try {
    const item = await ${modelName}.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data: item });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }
    res.status(400).json({ success: false, message: 'Bad request', error: error.message });
  }
});

// Delete
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await ${modelName}.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
`;

write('products.ts', crudFactory('Product', 'Product'));
write('services.ts', crudFactory('Service', 'Service'));
write('courses.ts', crudFactory('Course', 'Course'));
write('jobs.ts', crudFactory('Job', 'Job'));
write('blog.ts', crudFactory('BlogPost', 'BlogPost'));

// messages.ts
const messagesContent = `
import { Router } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Bad request', error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Marked as read', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
`;
write('messages.ts', messagesContent);

console.log('Backend routes rewritten');
