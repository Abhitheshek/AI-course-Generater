import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, Grid3X3, List, BookOpen } from 'lucide-react';

const Dashboard = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Add a useEffect to handle localStorage initialization if needed
  useEffect(() => {
    // Initialize localStorage if it doesn't exist yet
    if (typeof window !== 'undefined' && !localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify([]));
    }
  }, []);

  // Filter and sort courses when dependencies change
  useEffect(() => {
    let result = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'modules':
        result.sort((a, b) => (b.modules?.length || 0) - (a.modules?.length || 0));
        break;
      case 'progress':
        result.sort((a, b) => (b.progress?.overallProgress || 0) - (a.progress?.overallProgress || 0));
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [courses, searchTerm, sortBy]);

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full">
      {/* Search and filter bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={18} className="text-gray-600" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => document.getElementById('sortDropdown').classList.toggle('hidden')}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <SortAsc size={18} className="text-gray-600" />
              <span className="hidden sm:inline">Sort</span>
            </button>
            <div 
              id="sortDropdown" 
              className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100"
            >
              <ul className="py-1">
                <li>
                  <button 
                    onClick={() => {setSortBy('recent'); document.getElementById('sortDropdown').classList.add('hidden')}}
                    className={`px-4 py-2 w-full text-left hover:bg-gray-50 ${sortBy === 'recent' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    Most Recent
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {setSortBy('title'); document.getElementById('sortDropdown').classList.add('hidden')}}
                    className={`px-4 py-2 w-full text-left hover:bg-gray-50 ${sortBy === 'title' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    Title (A-Z)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {setSortBy('modules'); document.getElementById('sortDropdown').classList.add('hidden')}}
                    className={`px-4 py-2 w-full text-left hover:bg-gray-50 ${sortBy === 'modules' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    Most Modules
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {setSortBy('progress'); document.getElementById('sortDropdown').classList.add('hidden')}}
                    className={`px-4 py-2 w-full text-left hover:bg-gray-50 ${sortBy === 'progress' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    Progress
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-2.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter panel - conditionally shown */}
      {isFilterOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="all">All Courses</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="notStarted">Not Started</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="all">All Time</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module Count</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="all">Any</option>
                <option value="1-3">1-3 Modules</option>
                <option value="4-6">4-6 Modules</option>
                <option value="7+">7+ Modules</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No courses match your search criteria.' : 'No courses available yet.'}
          </p>
          <a 
            href="/openForm" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Create Your First Course
          </a>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
          }
        >
          {filteredCourses.map((course) => (
            <motion.div key={course._id} variants={cardVariants}>
              <CourseCard course={course} viewMode={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;