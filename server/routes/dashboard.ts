import { Router } from 'express';
import { Product } from '../models/Product';
import { Service } from '../models/Service';
import { Course } from '../models/Course';
import { Job } from '../models/Job';
import { BlogPost } from '../models/BlogPost';
import { ContactMessage } from '../models/ContactMessage';
import { authenticate } from '../middleware/auth';
import { CourseEnrollmentRequest } from '../models/CourseEnrollmentRequest';
import { JobApplication } from '../models/JobApplication';

const router = Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    const [
      productsCount,
      servicesCount,
      coursesCount,
      jobsCount,
      blogCount,
      unreadMessages
      ,pendingEnrollmentRequests, pendingJobApplications
    ] = await Promise.all([
      Product.countDocuments(),
      Service.countDocuments(),
      Course.countDocuments(),
      Job.countDocuments(),
      BlogPost.countDocuments(),
      ContactMessage.countDocuments({ status: 'unread' }),
      CourseEnrollmentRequest.countDocuments({ status: 'pending' }),
      JobApplication.countDocuments({ $or: [{ applicationStatus: 'submitted' }, { applicationStatus: { $exists: false }, status: 'pending' }] })
    ]);

    const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          products: productsCount,
          services: servicesCount,
          courses: coursesCount,
          jobs: jobsCount,
          posts: blogCount,
          unreadMessages
          ,pendingEnrollmentRequests,
          pendingJobApplications
        },
        recentActivity: recentMessages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
