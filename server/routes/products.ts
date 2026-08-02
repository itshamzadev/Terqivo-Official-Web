import mongoose from 'mongoose';
import { Router } from 'express';
import { Product } from '../models/Product';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all (public/admin)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({ success: true, data: [] });
  if (require('mongoose').connection.readyState !== 1) {
    return res.json({ success: true, data: [] });
  }
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error(error); res.status(500).json({ success: false, message: error instanceof Error ? error.message : String(error) });
  }
});

// Get single
router.get('/:idOrSlug', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(404).json({ success: false, message: 'DB Disconnected' });
  try {
    const { idOrSlug } = req.params;
    let item;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Product.findById(idOrSlug);
    } else {
      item = await Product.findOne({ slug: idOrSlug });
    }
    
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error(error); res.status(500).json({ success: false, message: error instanceof Error ? error.message : String(error) });
  }
});

// Create
router.post('/', authenticate, async (req, res) => {
  try {
    const item = new Product(req.body);
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
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error(error); res.status(500).json({ success: false, message: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
