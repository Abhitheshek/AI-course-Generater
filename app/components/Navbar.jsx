'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  BookOpen, 
  BarChart3, 
  Plus,
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
  }, [pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen || isNotificationOpen) {
        if (!event.target.closest('.user-menu') && !event.target.closest('.notification-menu')) {
          setIsUserMenuOpen(false);
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isNotificationOpen]);

  const isActive = (path) => {
    return pathname === path;
  };

  const isHomePage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3 text-white"
             animate={{ y: [0, -4, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
            >
              <BookOpen size={20} 
             />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">
                StudyBuddy
              </span>
              <span className="text-xs text-blue-600">
                AI Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  isActive('/dashboard') || isActive('/course')
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Courses
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2 bg-white rounded-lg shadow-md border border-gray-100">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <BarChart3 size={16} className="mr-2 text-blue-500" />
                    <span>Course Dashboard</span>
                  </Link>
                  
                  <Link 
                    href="/course" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <BookOpen size={16} className="mr-2 text-blue-500" />
                    <span>Browse Courses</span>
                  </Link>
                  
                  <Link 
                    href="/openForm" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus size={16} className="mr-2 text-blue-500" />
                    <span>Create New Course</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <Link 
              href="/progress" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/progress') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Progress
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Button */}
            <button className="p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
              <Search size={18} />
            </button>
            
            {/* Notifications */}
            {/* <div className="relative notification-menu">
              <button 
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsUserMenuOpen(false);
                }}
                className="p-2 rounded-lg transition-colors relative text-gray-700 hover:bg-gray-100"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-md py-2 border border-gray-100 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <p className="font-medium text-gray-800">Notifications</p>
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 border-l-2 border-blue-500">
                      <p className="text-sm text-gray-800">Your course <span className="font-medium">Machine Learning</span> has been generated!</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </div>
                    
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">You've completed <span className="font-medium">5 modules</span> this week!</p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                    
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">New flashcards are ready for <span className="font-medium">Web Development</span></p>
                      <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100 mt-2">
                    <button className="w-full py-2 text-sm text-center text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div> */}
            
            <Link 
              href="/openForm" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>New Course</span>
            </Link>
            
            {/* User menu */}
            <div className="relative user-menu">
              <button 
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  AY
                </div>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md py-2 border border-gray-100 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">Abhishek Yadav</p>
                    <p className="text-sm text-gray-500">quantumabhishek@gmail.com</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} className="mr-2 text-gray-500" />
                    <span>Your Profile</span>
                  </Link>
                  
                  <Link 
                    href="/settings" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} className="mr-2 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <BarChart3 size={16} className="mr-2 text-gray-500" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <hr className="my-1 border-gray-100" />
                  
                  <button 
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button className="p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
              <Search size={18} />
            </button>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                  AY
                </div>
                <div>
                  <p className="font-medium text-gray-800">Abhishek Yadav</p>
                  <p className="text-sm text-gray-500">quantumabhishek@gmail.com</p>
                </div>
              </div>
            </div>
            
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className={`px-4 py-3 rounded-lg ${isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Home
              </Link>
              
              <Link 
                href="/dashboard" 
                className={`px-4 py-3 rounded-lg ${isActive('/dashboard') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              
              <Link 
                href="/course" 
                className={`px-4 py-3 rounded-lg ${isActive('/course') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Courses
              </Link>
              
              <Link 
                href="/progress" 
                className={`px-4 py-3 rounded-lg ${isActive('/progress') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Progress
              </Link>
              
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Link 
                  href="/openForm" 
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg"
                >
                  <Plus size={16} />
                  <span>Create New Course</span>
                </Link>
              </div>
              
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Link 
                  href="/settings" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Settings size={16} className="mr-2" />
                  <span>Settings</span>
                </Link>
                
                <button 
                  className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left rounded-lg mt-1"
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}