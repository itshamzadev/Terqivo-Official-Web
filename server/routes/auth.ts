import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models';
import { authenticate } from '../middlewares/auth';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Default admin creation for first time
    const count = await AdminUser.countDocuments();
    if (count === 0 && email === (process.env.ADMIN_EMAIL || 'admin@terqivo.com')) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await AdminUser.create({
        name: process.env.ADMIN_NAME || 'Super Admin',
        email,
        password: hashedPassword,
        role: 'Super Admin'
      });
    }

    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      (process.env.JWT_SECRET || 'secret') as jwt.Secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    const cookieName = process.env.COOKIE_NAME || 'terqivo_admin_token';
    res.cookie(cookieName, token, {
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/logout', (req, res) => {
  const cookieName = process.env.COOKIE_NAME || 'terqivo_admin_token';
  res.clearCookie(cookieName);
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticate, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
