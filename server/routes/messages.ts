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
