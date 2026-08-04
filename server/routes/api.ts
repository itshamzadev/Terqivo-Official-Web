import { Router } from 'express';
import authRoutes from './auth';
import serviceRoutes from './services';
import productRoutes from './products';
import courseRoutes from './courses';
import jobRoutes from './jobs';
import blogRoutes from './blog';
import messageRoutes from './messages';
import enrollmentRoutes from './enrollments';
import applicationRoutes from './applications';
import uploadRoutes from './upload';
import dashboardRoutes from './dashboard';
import settingsRoutes from './settings';
import currencyRoutes from './currencies';
import paymentAccountRoutes from './paymentAccounts';
import courseEnrollmentRequestRoutes from './courseEnrollmentRequests';
import emailRoutes from './email';
import accountRoutes from './account';
import userRoutes from './users';
import whatsappRoutes from './whatsapp';

const router = Router();


router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/products', productRoutes);
router.use('/courses', courseRoutes);
router.use('/jobs', jobRoutes);
router.use('/blog', blogRoutes);
router.use('/messages', messageRoutes); // Keep for admin backwards compatibility if needed
router.use('/contact', messageRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/applications', applicationRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/currencies', currencyRoutes);
router.use('/payment-accounts', paymentAccountRoutes);
router.use('/course-enrollment-requests', courseEnrollmentRequestRoutes);
router.use('/email', emailRoutes);
router.use('/account', accountRoutes);
router.use('/users', userRoutes);
router.use('/whatsapp', whatsappRoutes);

export default router;
