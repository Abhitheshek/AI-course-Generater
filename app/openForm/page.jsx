"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseForm from '../components/CourseForm';
import { generateCourseContent } from '../lib/geminApi';
import { saveCourse } from '../lib/localStorage';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (courseTitle, difficultyLevel) => {
    setLoading(true);
    try {
      // Generate course content using Gemini API
      const data = await generateCourseContent(courseTitle, difficultyLevel);
      
      // Save the course data directly to localStorage
      const courseData = {
        title: data.title,
        description: data.description,
        modules: data.modules.map(module => ({
          title: module.title,
          content: module.briefDescription || '',
          quizzes: [],
          flashcards: []
        }))
      };
      
      const savedCourse = saveCourse(courseData);
      
      // Trigger a storage event to update other components
      const storageEvent = new StorageEvent('storage', {
        key: 'courses',
        newValue: localStorage.getItem('courses'),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
      
      // Navigate to the course page with the saved course ID
      router.push(`/course/${savedCourse._id}`);
    } catch (error) {
      console.error('Error generating or saving course:', error);
      alert('Failed to generate or save course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero section with enhanced gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <motion.div variants={itemVariants} className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Create New Course</h1>
              <p className="text-blue-100 max-w-lg text-lg">
                Design your custom learning experience with our AI-powered course generator
              </p>
              <div className="flex items-center gap-2 mt-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs font-bold">AI</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-white flex items-center justify-center text-white">
                    <Sparkles size={14} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-white">
                    <BookOpen size={14} />
                  </div>
                </div>
                <span className="text-sm text-blue-100">Powered by advanced AI</span>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors shadow-lg"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#f9fafb" 
              fillOpacity="1" 
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,74.7C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12 -mt-6 relative z-10">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8"
        >
          <CourseForm onSubmit={handleSubmit} loading={loading} />
        </motion.div>
        
        {/* Features section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Content</h3>
            <p className="text-gray-600">
              Our advanced AI generates comprehensive course materials tailored to your specific learning needs
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Engage with quizzes, flashcards, and interactive modules to enhance your understanding
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white mb-4">
              <ArrowLeft size={24} className="rotate-180" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics and progress tracking
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}