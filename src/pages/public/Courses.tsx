import { useEffect, useState } from 'react';
import { CoursesHero } from './courses/CoursesHero';
import { LearningDirection } from './courses/LearningDirection';
import { FeaturedCourse } from './courses/FeaturedCourse';
import { CoursesGrid } from './courses/CoursesGrid';
import { LearningCategories } from './courses/LearningCategories';
import { CourseDesign } from './courses/CourseDesign';
import { LearningJourney } from './courses/LearningJourney';
import { CoursesFAQ } from './courses/CoursesFAQ';
import { CoursesCTA } from './courses/CoursesCTA';

export interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  coverImage?: string;
  category?: string;
  level?: string;
  duration?: string;
  deliveryFormat?: string;
  language?: string;
  price?: number;
  instructor?: string;
  status: string;
  featured?: boolean;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await res.json();
        setCourses((data.data || []).filter((c: any) => c.status !== 'draft' && c.status !== 'archived'));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const featuredCourse = courses.find((c) => c.featured) || null;
  const regularCourses = courses.filter((c) => c._id !== featuredCourse?._id);

  return (
    <div className="flex flex-col w-full">
      <CoursesHero />
      <LearningDirection />
      <FeaturedCourse course={featuredCourse} />
      <CoursesGrid courses={regularCourses} isLoading={isLoading} hasError={hasError} />
      <LearningCategories />
      <CourseDesign />
      <LearningJourney />
      <CoursesFAQ />
      <CoursesCTA />
    </div>
  );
}
