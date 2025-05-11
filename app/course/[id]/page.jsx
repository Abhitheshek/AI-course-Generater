"use client";
import { useState, useEffect } from 'react';
import { use } from 'react';
import CourseDisplay from '../../components/CourseDisplay';
import { getCourseById } from '@/app/lib/localStorage';

export default function CourseDetailPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;
  
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = () => {
      try {
        // Get course directly from localStorage
        const course = getCourseById(courseId);
        if (!course) {
          throw new Error('Course not found');
        }
        setCourseData(course);
      } catch (err) {
        setError(err.message);
        console.error('Error loading course from localStorage:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadCourse();

    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'courses') {
        loadCourse();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-xl">Error loading course: {error || 'Course not found'}</p>
          <a href="/" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-2 md:p-8">
      <div className="max-w-6xl mx-auto">
        <CourseDisplay courseData={courseData} />
      </div>
    </main>
  );
}