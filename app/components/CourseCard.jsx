import React from 'react';
import Link from 'next/link';
import { Calendar, BookOpen, BarChart3, ArrowRight, Clock } from 'lucide-react';

const CourseCard = ({ course, viewMode = 'grid' }) => {
  // Calculate progress percentage
  const progress = course.progress?.overallProgress || 0;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get last accessed date or creation date
  const lastAccessed = course.progress?.lastAccessed 
    ? formatDate(course.progress.lastAccessed)
    : formatDate(course.createdAt);
  
  // Determine status and badge color
  let statusBadge = { text: 'Not Started', color: 'bg-gray-100 text-gray-600' };
  
  if (course.progress?.completed) {
    statusBadge = { text: 'Completed', color: 'bg-green-100 text-green-700' };
  } else if (progress > 0) {
    statusBadge = { text: 'In Progress', color: 'bg-blue-100 text-blue-700' };
  }
  
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="p-5 flex flex-col md:flex-row gap-4 items-center">
          {/* Course icon/image */}
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          
          {/* Course info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge.color} md:ml-2`}>
                {statusBadge.text}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1 line-clamp-1">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <BookOpen size={14} className="mr-1" />
                {course.modules?.length || 0} modules
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                Last accessed {lastAccessed}
              </div>
              <div className="flex items-center">
                <BarChart3 size={14} className="mr-1" />
                {progress}% complete
              </div>
            </div>
          </div>
          
          {/* Progress bar and action button */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2 min-w-[120px]">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <Link 
              href={`/course/${course._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              View Course
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Default grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Card header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 relative">
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
        <div className="h-16 flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="text-white" size={24} />
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <BookOpen size={14} className="mr-1" />
            {course.modules?.length || 0} modules
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={14} className="mr-1" />
            {lastAccessed}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Card footer */}
      <div className="p-5 border-t border-gray-100">
        <Link 
          href={`/course/${course._id}`}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          View Course
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;