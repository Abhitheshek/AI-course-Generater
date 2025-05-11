// localStorage utility functions for course data management

// Helper to generate a unique ID (similar to MongoDB ObjectId)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all courses from localStorage
export const getAllCourses = () => {
  if (typeof window === 'undefined') {
    return []; // Return empty array on server-side
  }
  
  try {
    const courses = localStorage.getItem('courses');
    return courses ? JSON.parse(courses) : [];
  } catch (error) {
    console.error('Error getting courses from localStorage:', error);
    return [];
  }
};

// Get a single course by ID
export const getCourseById = (id) => {
  const courses = getAllCourses();
  return courses.find(course => course._id === id) || null;
};

// Save a new course
export const saveCourse = (courseData) => {
  try {
    const courses = getAllCourses();
    const newCourse = {
      ...courseData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      progress: {
        completed: false,
        completedModules: [],
        lastAccessed: new Date().toISOString(),
        overallProgress: 0
      }
    };
    
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    return newCourse;
  } catch (error) {
    console.error('Error saving course to localStorage:', error);
    throw new Error('Failed to save course to localStorage');
  }
};

// Update an existing course
export const updateCourse = (id, courseData) => {
  try {
    const courses = getAllCourses();
    const index = courses.findIndex(course => course._id === id);
    
    if (index === -1) {
      throw new Error('Course not found');
    }
    
    courses[index] = {
      ...courses[index],
      ...courseData,
      _id: id // Ensure ID doesn't change
    };
    
    localStorage.setItem('courses', JSON.stringify(courses));
    return courses[index];
  } catch (error) {
    console.error('Error updating course in localStorage:', error);
    throw new Error('Failed to update course in localStorage');
  }
};

// Delete a course
export const deleteCourse = (id) => {
  try {
    const courses = getAllCourses();
    const filteredCourses = courses.filter(course => course._id !== id);
    localStorage.setItem('courses', JSON.stringify(filteredCourses));
    return true;
  } catch (error) {
    console.error('Error deleting course from localStorage:', error);
    throw new Error('Failed to delete course from localStorage');
  }
};

// Progress tracking functions
export const getUserProgress = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const progress = localStorage.getItem('userProgress');
    return progress ? JSON.parse(progress) : {
      totalTimeSpent: 0, // in minutes
      lastLogin: new Date().toISOString(),
      streakDays: 0,
      completedCourses: 0,
      completedModules: 0,
      completedQuizzes: 0,
      quizScores: [],
      flashcards: {
        totalReviewed: 0,
        knownCount: 0,
        reviewCount: 0,
        longestStreak: 0,
        lastStudied: null,
        moduleStats: {} // Will store stats by moduleId
      },
      learningGoals: {
        dailyTarget: 30, // minutes
        weeklyTarget: 3, // courses
      }
    };
  } catch (error) {
    console.error('Error getting user progress from localStorage:', error);
    return null;
  }
};

export const updateUserProgress = (progressData) => {
  try {
    const currentProgress = getUserProgress() || {};
    const updatedProgress = {
      ...currentProgress,
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
    return updatedProgress;
  } catch (error) {
    console.error('Error updating user progress in localStorage:', error);
    throw new Error('Failed to update user progress in localStorage');
  }
};

export const trackModuleCompletion = (courseId, moduleId) => {
  try {
    // Update course progress
    const course = getCourseById(courseId);
    if (!course) return false;
    
    // If module is not already marked as completed
    if (!course.progress.completedModules.includes(moduleId)) {
      const completedModules = [...course.progress.completedModules, moduleId];
      const overallProgress = Math.round((completedModules.length / course.modules.length) * 100);
      const completed = overallProgress === 100;
      
      const updatedCourse = updateCourse(courseId, {
        progress: {
          ...course.progress,
          completedModules,
          overallProgress,
          completed,
          lastAccessed: new Date().toISOString()
        }
      });
      
      // Update overall user progress
      const userProgress = getUserProgress();
      updateUserProgress({
        completedModules: userProgress.completedModules + 1,
        completedCourses: completed ? userProgress.completedCourses + 1 : userProgress.completedCourses
      });
      
      return updatedCourse;
    }
    
    return course;
  } catch (error) {
    console.error('Error tracking module completion:', error);
    return false;
  }
};

export const trackQuizCompletion = (courseId, moduleId, score) => {
  try {
    // Update user progress with quiz score
    const userProgress = getUserProgress();
    const quizScores = [...(userProgress.quizScores || []), { 
      courseId, 
      moduleId, 
      score, 
      date: new Date().toISOString() 
    }];
    
    updateUserProgress({
      completedQuizzes: userProgress.completedQuizzes + 1,
      quizScores
    });
    
    return true;
  } catch (error) {
    console.error('Error tracking quiz completion:', error);
    return false;
  }
};

// Track flashcard study progress
export const trackFlashcardProgress = (moduleId, studyStats) => {
  try {
    const userProgress = getUserProgress();
    const { flashcards } = userProgress;
    
    // Get existing module stats or initialize new ones
    const moduleStats = flashcards.moduleStats[moduleId] || {
      totalReviewed: 0,
      knownCount: 0,
      reviewCount: 0,
      highestStreak: 0,
      lastStudied: null
    };
    
    // Update module stats
    const updatedModuleStats = {
      totalReviewed: moduleStats.totalReviewed + (studyStats.totalReviewed || 0),
      knownCount: studyStats.knownCount || 0, // Replace with current count
      reviewCount: studyStats.reviewCount || 0, // Replace with current count
      highestStreak: Math.max(moduleStats.highestStreak, studyStats.streakCount || 0),
      lastStudied: new Date().toISOString()
    };
    
    // Update overall flashcard stats
    const totalKnownCount = Object.values(flashcards.moduleStats)
      .reduce((sum, stat) => sum + (stat.knownCount || 0), 0) + studyStats.knownCount;
    
    const totalReviewCount = Object.values(flashcards.moduleStats)
      .reduce((sum, stat) => sum + (stat.reviewCount || 0), 0) + studyStats.reviewCount;
    
    const updatedFlashcards = {
      ...flashcards,
      totalReviewed: flashcards.totalReviewed + (studyStats.totalReviewed || 0),
      knownCount: totalKnownCount,
      reviewCount: totalReviewCount,
      longestStreak: Math.max(flashcards.longestStreak || 0, studyStats.streakCount || 0),
      lastStudied: new Date().toISOString(),
      moduleStats: {
        ...flashcards.moduleStats,
        [moduleId]: updatedModuleStats
      }
    };
    
    updateUserProgress({ flashcards: updatedFlashcards });
    return updatedFlashcards;
  } catch (error) {
    console.error('Error tracking flashcard progress:', error);
    return false;
  }
};

export const updateLearningTime = (minutes) => {
  try {
    const userProgress = getUserProgress();
    const totalTimeSpent = (userProgress.totalTimeSpent || 0) + minutes;
    
    // Check if we need to update streak
    const lastLogin = new Date(userProgress.lastLogin);
    const today = new Date();
    const isNewDay = 
      lastLogin.getDate() !== today.getDate() || 
      lastLogin.getMonth() !== today.getMonth() || 
      lastLogin.getFullYear() !== today.getFullYear();
    
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() - 1);
    const isConsecutiveDay = 
      lastLogin.getDate() === yesterdayDate.getDate() && 
      lastLogin.getMonth() === yesterdayDate.getMonth() && 
      lastLogin.getFullYear() === yesterdayDate.getFullYear();
    
    let streakDays = userProgress.streakDays || 0;
    if (isNewDay) {
      if (isConsecutiveDay) {
        streakDays += 1;
      } else if (lastLogin < yesterdayDate) {
        // Reset streak if more than a day has passed
        streakDays = 1;
      }
    }
    
    updateUserProgress({
      totalTimeSpent,
      lastLogin: today.toISOString(),
      streakDays
    });
    
    return { totalTimeSpent, streakDays };
  } catch (error) {
    console.error('Error updating learning time:', error);
    return false;
  }
};

// Get learning statistics
export const getLearningStats = () => {
  try {
    const courses = getAllCourses();
    const userProgress = getUserProgress();
    
    if (!userProgress) return null;
    
    const totalCourses = courses.length;
    const completedCourses = courses.filter(course => course.progress?.completed).length;
    const inProgressCourses = courses.filter(course => 
      course.progress?.overallProgress > 0 && !course.progress?.completed
    ).length;
    
    const totalModules = courses.reduce((acc, course) => acc + (course.modules?.length || 0), 0);
    const completedModules = userProgress.completedModules || 0;
    
    const averageQuizScore = userProgress.quizScores && userProgress.quizScores.length > 0
      ? userProgress.quizScores.reduce((acc, quiz) => acc + quiz.score, 0) / userProgress.quizScores.length
      : 0;
    
    // Calculate daily streak
    const streakDays = userProgress.streakDays || 0;
    
    // Calculate time spent today
    const today = new Date().toDateString();
    const todayQuizzes = userProgress.quizScores?.filter(quiz => 
      new Date(quiz.date).toDateString() === today
    ) || [];
    
    // Get flashcard stats
    const flashcardStats = userProgress.flashcards || {
      totalReviewed: 0,
      knownCount: 0,
      reviewCount: 0,
      longestStreak: 0,
      lastStudied: null
    };
    
    // Calculate if flashcards were studied today
    const flashcardsStudiedToday = flashcardStats.lastStudied ? 
      new Date(flashcardStats.lastStudied).toDateString() === today : false;
    
    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      courseCompletionRate: totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0,
      totalModules,
      completedModules,
      moduleCompletionRate: totalModules > 0 ? (completedModules / totalModules) * 100 : 0,
      totalQuizzes: userProgress.completedQuizzes || 0,
      averageQuizScore,
      streakDays,
      totalTimeSpent: userProgress.totalTimeSpent || 0,
      quizzesToday: todayQuizzes.length,
      flashcards: {
        ...flashcardStats,
        studiedToday: flashcardsStudiedToday,
        masteryRate: flashcardStats.totalReviewed > 0 ? 
          (flashcardStats.knownCount / (flashcardStats.knownCount + flashcardStats.reviewCount)) * 100 : 0
      },
      learningGoals: userProgress.learningGoals || { dailyTarget: 30, weeklyTarget: 3 }
    };
  } catch (error) {
    console.error('Error calculating learning stats:', error);
    return null;
  }
};