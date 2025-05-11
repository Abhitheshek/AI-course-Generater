"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseDisplay from '../components/CourseDisplay';

export default function CoursePage() {
  const searchParams = useSearchParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get course data from query params first
    const dataParam = searchParams.get('data');
    
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        setCourseData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing course data:', error);
        setLoading(false);
      }
    } else {
      // If no data in query params, try to get the latest course from API
      const fetchLatestCourse = async () => {
        try {
          const response = await fetch('/api/courses');
          if (!response.ok) {
            throw new Error('Failed to fetch courses');
          }
          const data = await response.json();
          if (data.courses && data.courses.length > 0) {
            // Get the most recently created course
            const latestCourse = data.courses[data.courses.length - 1];
            setCourseData(latestCourse);
          }
        } catch (error) {
          console.error('Error fetching course:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLatestCourse();
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-xl">No course data available.</p>
          <a href="/openForm" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Create a Course
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-2  md:p-4">
      <div className="max-w-6xl  md:mx-auto mx-2 ">
        <CourseDisplay courseData={courseData} />
      </div>
    </main>
  );
}