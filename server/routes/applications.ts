
import { Router } from 'express';
import { JobApplication } from '../models/JobApplication';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create (Public usually, but keep same format)
router.post('/', async (req, res) => {
  try {
    const item = new JobApplication(req.body);
    await item.save();
    res.status(201).json({ success: true, message: 'Submitted successfully', data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Bad request', error: error.message });
  }
});

// Admin routes below
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await JobApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const item = await JobApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Bad request', error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await JobApplication.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
