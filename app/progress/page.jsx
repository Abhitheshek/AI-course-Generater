'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Target, 
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Circle,
  Flame
} from 'lucide-react';
import { getLearningStats, getAllCourses, updateLearningTime } from '../lib/localStorage';
// Using inline components instead of importing
// We'll define these components directly in this file

export default function ProgressDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    // Simulate tracking time spent on the dashboard
    const startTime = new Date();
    
    const loadStats = () => {
      const learningStats = getLearningStats();
      setStats(learningStats || {
        streakDays: 0,
        totalTimeSpent: 0,
        completedCourses: 0,
        totalCourses: 0,
        inProgressCourses: 0,
        courseCompletionRate: 0,
        averageQuizScore: 0,
        totalQuizzes: 0,
        quizzesToday: 0,
        learningGoals: { dailyTarget: 30, weeklyTarget: 1 }
      });
      
      // Get all courses
      const allCourses = getAllCourses();
      setCourses(allCourses || []);
      
      // Get recent courses (sorted by last accessed)
      const sorted = [...(allCourses || [])].sort((a, b) => {
        const dateA = new Date(a.progress?.lastAccessed || a.createdAt);
        const dateB = new Date(b.progress?.lastAccessed || b.createdAt);
        return dateB - dateA;
      }).slice(0, 3); // Get top 3 recent courses
      
      setRecentCourses(sorted);
      
      // Set first course as selected by default if available
      if (allCourses && allCourses.length > 0) {
        setSelectedCourse(allCourses[0]);
        processModulesAndQuizzes(allCourses[0]);
      }
      
      setLoading(false);
    };
    
    loadStats();
    
    // Update time spent when component unmounts
    return () => {
      const endTime = new Date();
      const minutesSpent = Math.round((endTime - startTime) / 60000);
      if (minutesSpent > 0) {
        updateLearningTime(minutesSpent);
      }
    };
  }, []);

  // Get score color based on score value
  const getScoreColor = (score) => {
    if (score === undefined) return 'gray-100 text-gray-500';
    if (score >= 80) return 'green-100 text-green-700';
    if (score >= 60) return 'yellow-100 text-yellow-700';
    return 'red-100 text-red-700';
  };
  
  // Calculate average quiz score
  const getAverageScore = () => {
    const scores = quizData
      .filter(quiz => quiz.completed && quiz.score !== undefined)
      .map(quiz => quiz.score);
    return scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
  };

  // Process modules and quizzes for the selected course
  const processModulesAndQuizzes = (course) => {
    if (!course || !course.modules) {
      setModuleData([]);
      setQuizData([]);
      return;
    }

    // Process modules
    const modules = course.modules.map(module => ({
      title: module.title,
      completed: module.completed || false,
      progress: module.progress || 0,
      timeSpent: module.timeSpent || 0
    }));
    setModuleData(modules);

    // Process quizzes
    const quizzes = [];
    course.modules.forEach(module => {
      if (module.quizzes && module.quizzes.length > 0) {
        module.quizzes.forEach(quiz => {
          quizzes.push({
            title: quiz.title || `Quiz for ${module.title}`,
            moduleName: module.title,
            completed: quiz.completed || false,
            score: quiz.score,
            timeSpent: quiz.timeSpent || 0
          });
        });
      }
    });
    setQuizData(quizzes);
  };

  // Handle course selection change
  const handleCourseChange = (courseId) => {
    const selected = courses.find(c => c._id === courseId);
    setSelectedCourse(selected);
    processModulesAndQuizzes(selected);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Format minutes into hours and minutes
  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
    <div className="px-6 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Learning Progress</h1>
          <Link href="/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Stats Overview Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Learning Streak */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-1">Current Streak</p>
                <h3 className="text-3xl font-bold">{stats.streakDays || 0} days</h3>
                <p className="mt-1 text-amber-100 text-sm">Keep it going!</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-100">Daily Goal</span>
                <span className="text-xs font-medium">{stats.learningGoals?.dailyTarget || 30} min</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                <div 
                  className="bg-white h-2 rounded-full" 
                  style={{ width: `${Math.min(100, ((stats.totalTimeSpent || 0) / (stats.learningGoals?.dailyTarget || 30)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Time Spent */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Learning Time</p>
                <h3 className="text-3xl font-bold text-gray-800">{formatTime(stats.totalTimeSpent || 0)}</h3>
                <p className="mt-1 text-gray-500 text-sm">Across all courses</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>Last session: Today</span>
              </div>
            </div>
          </motion.div>

          {/* Course Progress */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Course Completion</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.completedCourses || 0}/{stats.totalCourses || 0}
                </h3>
                <p className="mt-1 text-gray-500 text-sm">
                  {stats.inProgressCourses || 0} in progress
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Completion Rate</span>
                <span className="text-xs font-medium">{Math.round(stats.courseCompletionRate || 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.courseCompletionRate || 0}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Quiz Performance */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Quiz Performance</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {Math.round(stats.averageQuizScore || 0)}%
                </h3>
                <p className="mt-1 text-gray-500 text-sm">
                  {stats.totalQuizzes || 0} quizzes completed
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Target className="h-4 w-4 mr-1 text-gray-400" />
                <span>{stats.quizzesToday || 0} quizzes today</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Course Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Course Progress Tracker</h2>
            
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-64 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={selectedCourse?._id || ''}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="" disabled>Select a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedCourse ? (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{selectedCourse.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCourse.description && selectedCourse.description.length > 100 
                      ? selectedCourse.description.substring(0, 100) + '...' 
                      : selectedCourse.description}
                  </p>
                </div>
                <Link 
                  href={`/course/${selectedCourse._id}`}
                  className="mt-2 md:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Course
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedCourse.progress?.overallProgress || 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-indigo-600 h-2.5 rounded-full"
                />
              </div>
              
              <div className="flex justify-between text-sm mt-2 mb-6">
                <span className="text-gray-500">Overall Progress</span>
                <span className="font-medium">{selectedCourse.progress?.overallProgress || 0}%</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-700">{selectedCourse.modules?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Modules</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-purple-700">
                    {selectedCourse.modules?.reduce((total, module) => 
                      total + (module.quizzes?.length || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-700">
                    {formatTime(selectedCourse.modules?.reduce((total, module) => 
                      total + (module.timeSpent || 0), 0) || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Time Spent</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <BookOpen size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Course Selected</h3>
              <p className="text-gray-500 mb-6">
                {courses.length > 0 
                  ? 'Please select a course to view detailed progress' 
                  : 'You haven\'t created any courses yet'}
              </p>
              {courses.length === 0 && (
                <Link 
                  href="/openForm"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create Your First Course
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Module and Quiz Progress */}
        {selectedCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Module Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Module Progress</h2>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {moduleData.filter(m => m.completed).length}/{moduleData.length}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${moduleData.length > 0 ? Math.round((moduleData.filter(m => m.completed).length / moduleData.length) * 100) : 0}%` }}
                ></div>
              </div>

              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                {moduleData.map((module, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      {module.completed ? (
                        <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <Circle size={16} className="text-gray-300 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{module.title}</p>
                        {module.progress !== undefined && (
                          <div className="flex items-center mt-1">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                              <div 
                                className="h-1.5 bg-blue-500 rounded-full" 
                                style={{ width: `${module.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{module.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/module/${encodeURIComponent(module.title)}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 flex-shrink-0"
                    >
                      {module.completed ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                ))}
                
                {moduleData.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No modules available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quiz Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Quiz Performance</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {quizData.filter(q => q.completed).length}/{quizData.length}
                  </div>
                  {quizData.filter(q => q.completed && q.score !== undefined).length > 0 && (
                    <div className={`bg-${getScoreColor(getAverageScore())} text-xs font-medium px-2.5 py-1 rounded-full`}>
                      {getAverageScore()}% avg
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${quizData.length > 0 ? Math.round((quizData.filter(q => q.completed).length / quizData.length) * 100) : 0}%` }}
                ></div>
              </div>

              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                {quizData.map((quiz, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      {quiz.completed ? (
                        <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <Circle size={16} className="text-gray-300 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {quiz.title || `Quiz ${index + 1}`}
                        </p>
                        {quiz.moduleName && (
                          <p className="text-xs text-gray-500 mt-0.5">{quiz.moduleName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {quiz.score !== undefined ? (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(quiz.score)}`}>
                          {quiz.score}%
                        </span>
                      ) : quiz.completed ? (
                        <span className="text-xs text-gray-500">No score</span>
                      ) : null}
                      
                      <Link 
                        href={`/quiz/${encodeURIComponent(quiz.moduleName || 'unknown')}`}
                        className="text-xs font-medium text-purple-600 hover:text-purple-800 flex-shrink-0"
                      >
                        {quiz.completed ? 'Retry' : 'Take Quiz'}
                      </Link>
                    </div>
                  </div>
                ))}
                
                {quizData.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No quizzes available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          
          <div className="space-y-6">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div key={course._id} className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {course.modules?.length || 0} modules • {course.progress?.overallProgress || 0}% complete
                        </p>
                      </div>
                      <Link 
                        href={`/course/${course._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        Continue
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ width: `${course.progress?.overallProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
                <Link 
                  href="/openForm"
                  className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Create Your First Course
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}