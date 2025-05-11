'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import StatsCard from '../components/StatsCard';
import EmptyStateCard from '../components/EmptyStateCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Plus, 
  BookOpenCheck, 
  FlaskConical, 
  Layers, 
  BarChart3,
  Clock,
  Award,
  Lightbulb,
  BrainCircuit,
  ChevronRight
} from 'lucide-react';
import { getAllCourses, getLearningStats } from '../lib/localStorage';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    // Function to load courses and stats from localStorage
    const loadData = () => {
      try {
        // Check if we're on the client side
        if (typeof window !== 'undefined') {
          const courseData = getAllCourses();
          setCourses(courseData || []);
          
          const learningStats = getLearningStats();
          setStats(learningStats);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading data from localStorage:', err);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadData();

    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'courses' || e.key === 'userProgress') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate stats
  const totalCourses = courses.length;
  const totalModules = courses.reduce((acc, course) => acc + (course.modules?.length || 0), 0);
  const totalQuizzes = courses.reduce((acc, course) => {
    return acc + course.modules?.reduce((moduleAcc, module) => {
      return moduleAcc + (module.quizzes?.length || 0);
    }, 0) || 0;
  }, 0);
  
  // Format time (minutes to hours and minutes)
  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <p className="mt-2">Please check your browser's localStorage or try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
    <div className="px-6 py-8">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl mb-8 overflow-hidden relative">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="px-8 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Dashboard</h1>
              <p className="text-blue-100 max-w-lg opacity-90">
                Track your progress, manage your courses, and enhance your learning journey
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/progress" 
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors shadow-lg"
              >
                <BarChart3 size={18} />
                Progress
              </Link>
              <Link 
                href="/openForm" 
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Plus size={18} />
                New Course
              </Link>
            </div>
          </div>
          
          {/* Quick stats in hero section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{totalCourses}</div>
                  <div className="text-blue-100 text-sm">Courses</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{totalModules}</div>
                  <div className="text-blue-100 text-sm">Modules</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats?.streakDays || 0}</div>
                  <div className="text-blue-100 text-sm">Day Streak</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{formatTime(stats?.totalTimeSpent || 0)}</div>
                  <div className="text-blue-100 text-sm">Learning Time</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course List */}
        <div className="lg:col-span-2">
          {/* Detailed Stats Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={itemVariants}>
              <StatsCard 
                title="Total Courses" 
                value={totalCourses} 
                icon={<BookOpen className="text-blue-600" size={24} />}
                description={`${stats?.completedCourses || 0} completed`}
                trend={stats?.completedCourses > 0 ? {
                  value: `${Math.round((stats.completedCourses / totalCourses) * 100)}%`,
                  label: 'completion rate'
                } : null}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StatsCard 
                title="Learning Time" 
                value={formatTime(stats?.totalTimeSpent || 0)} 
                icon={<Clock className="text-green-600" size={24} />}
                description="Total time spent learning"
                trend={stats?.streakDays > 0 ? {
                  value: `${stats.streakDays} days`,
                  label: 'current streak'
                } : null}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StatsCard 
                title="Quiz Performance" 
                value={`${Math.round(stats?.averageQuizScore || 0)}%`} 
                icon={<Award className="text-purple-600" size={24} />}
                description={`${stats?.totalQuizzes || 0} quizzes taken`}
                trend={stats?.quizzesToday > 0 ? {
                  value: `${stats.quizzesToday}`,
                  label: 'quizzes today'
                } : null}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StatsCard 
                title="Flashcards" 
                value={stats?.flashcards?.totalReviewed || 0} 
                icon={<BrainCircuit className="text-amber-600" size={24} />}
                description="Cards reviewed"
                trend={stats?.flashcards?.knownCount > 0 ? {
                  value: `${Math.round(stats.flashcards.masteryRate || 0)}%`,
                  label: 'mastery rate'
                } : null}
              />
            </motion.div>
          </motion.div>

          {/* Tab navigation */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'courses'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Your Courses
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'recent'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'recommendations'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recommendations
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            {activeTab === 'courses' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
                  <div className="text-sm text-gray-500">{totalCourses} courses</div>
                </div>
                
                {totalCourses > 0 ? (
                  <Dashboard courses={courses} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <EmptyStateCard 
                      title="Create Your First Course" 
                      description="Start by creating a new course to organize your learning materials."
                      icon={<BookOpenCheck className="text-blue-600" size={24} />}
                      linkText="Create Course"
                      linkHref="/openForm"
                    />
                    <EmptyStateCard 
                      title="Add Quizzes" 
                      description="Test your knowledge with interactive quizzes once you've created a course."
                      icon={<FlaskConical className="text-blue-600" size={24} />}
                    />
                    <EmptyStateCard 
                      title="Create Flashcards" 
                      description="Enhance your learning with flashcards for quick review and memorization."
                      icon={<Layers className="text-blue-600" size={24} />}
                    />
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'recent' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                </div>
                
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.slice(0, 5).map(course => (
                      <div key={course._id} className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800">{course.title}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(course.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{course.description}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${course.progress?.overallProgress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                      <Clock size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No recent activity</h3>
                    <p className="text-gray-600 mb-6">
                      Start learning to see your activity here
                    </p>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'recommendations' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recommended For You</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200 hover:shadow-md transition-shadow">
                    <div className="bg-amber-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Flashcards</h3>
                    <p className="text-gray-600 mb-4">
                      Enhance your learning with flashcards for better retention and quick reviews.
                    </p>
                    <Link 
                      href="/course"
                      className="text-amber-600 font-medium hover:text-amber-700 flex items-center"
                    >
                      Get started
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow">
                    <div className="bg-blue-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Take a Quiz</h3>
                    <p className="text-gray-600 mb-4">
                      Test your knowledge with interactive quizzes to reinforce your learning.
                    </p>
                    <Link 
                      href="/course"
                      className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
                    >
                      Start quiz
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 hover:shadow-md transition-shadow">
                    <div className="bg-purple-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Complete a Module</h3>
                    <p className="text-gray-600 mb-4">
                      Continue your learning journey by completing an in-progress module.
                    </p>
                    <Link 
                      href="/course"
                      className="text-purple-600 font-medium hover:text-purple-700 flex items-center"
                    >
                      Continue learning
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Right Column - Learning Insights */}
        <div className="space-y-6">
          {/* Learning Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Learning Insights</h2>
              <Link 
                href="/progress"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Learning Time</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {formatTime(stats?.weeklyTimeSpent || 0)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Quiz Score</p>
                    <p className="text-xs text-gray-500">Average</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {Math.round(stats?.averageQuizScore || 0)}%
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Completion Rate</p>
                    <p className="text-xs text-gray-500">All courses</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-green-700">
                  {Math.round(stats?.courseCompletionRate || 0)}%
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Weekly Goal Progress</p>
                <p className="text-xs text-gray-500">
                  {stats?.weeklyTimeSpent || 0}/{stats?.learningGoals?.weeklyTarget || 120} minutes
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, ((stats?.weeklyTimeSpent || 0) / (stats?.learningGoals?.weeklyTarget || 120)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Popular Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Popular Courses</h2>
            
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses
                  .sort((a, b) => (b.progress?.overallProgress || 0) - (a.progress?.overallProgress || 0))
                  .slice(0, 3)
                  .map(course => (
                    <div key={course._id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate">{course.title}</h3>
                        <div className="flex items-center mt-1">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                            <div 
                              className="h-1.5 bg-blue-500 rounded-full" 
                              style={{ width: `${course.progress?.overallProgress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{course.progress?.overallProgress || 0}%</span>
                        </div>
                      </div>
                      <Link 
                        href={`/course/${course._id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No courses available</p>
                <Link 
                  href="/openForm"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Course
                </Link>
              </div>
            )}
          </div>
          
          {/* Learning Tip */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold">Learning Tip</h2>
            </div>
            
            <p className="text-blue-100 mb-4">
              Breaking your study sessions into 25-minute focused intervals with short breaks can improve retention and reduce fatigue.
            </p>
            
            <Link 
              href="/progress"
              className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              More Tips
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}