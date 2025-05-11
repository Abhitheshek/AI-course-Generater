'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Star,
  Users,
  Lightbulb,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
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
  
  // Pre-generate random positions for particles to avoid hydration mismatch
  const [particlePositions, setParticlePositions] = useState([]);
  const [circlePositions, setCirclePositions] = useState([]);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // Generate consistent random positions on component mount (client-side only)
  useEffect(() => {
    // For hero section particles
    const heroParticles = Array(6).fill().map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2
    }));
    
    // For animated circles in How It Works section
    const animatedCircles = Array(5).fill().map(() => ({
      width: `${30 + Math.random() * 40}px`,
      height: `${30 + Math.random() * 40}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 2
    }));
    
    // For floating particles in CTA section
    const ctaParticles = Array(8).fill().map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2
    }));
    
    setParticlePositions(heroParticles);
    setCirclePositions(animatedCircles);
    setFloatingParticles(ctaParticles);
    setIsClient(true);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-gradient-to-tr from-indigo-400/10 to-pink-500/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0">
            {isClient && particlePositions.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                style={{
                  top: particle.top,
                  left: particle.left,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.delay,
                }}
              />
            ))}
          </div>
          
          {/* Mesh grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 py-10 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-16 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium text-white/90">AI-Powered Learning Platform</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                  Learn Anything, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200">Master Everything</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100/90 mb-10 max-w-lg leading-relaxed">
                  Create personalized courses, track your progress, and enhance your learning with AI-powered tools.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link 
                    href="/openForm" 
                    className="group px-8 py-4 bg-white text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center">
                      Create Your First Course
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight size={18} className="ml-2" />
                      </motion.div>
                    </span>
                  </Link>
                  
                  <Link 
                    href="/course" 
                    className="group px-8 py-4 bg-blue-600/30 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-blue-600/50 transition-all duration-300 border border-blue-400/30 flex items-center justify-center relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/40 to-indigo-500/40 group-hover:w-full transition-all duration-500"></span>
                    <span className="relative">Explore Courses</span>
                  </Link>
                </div>
                
                <div className="mt-10 flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${
                        ['bg-blue-400', 'bg-indigo-400', 'bg-purple-400', 'bg-pink-400'][i]
                      }`}></div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <span className="font-semibold">2,000+</span>
                    <span className="ml-1 text-blue-100/80 text-sm">learners joined</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500 rounded-full blur-xl opacity-30"></div>
                  <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl opacity-30"></div>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-auto px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium">Dashboard</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-white/15 to-white/5 rounded-xl p-5 border border-white/10 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                          <BookOpen size={20} className="text-white" />
                        </div>
                        <h3 className="font-semibold text-lg">Machine Learning Fundamentals</h3>
                      </div>
                      
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                        ></motion.div>
                      </div>
                      
                      <div className="flex justify-between mt-3 text-sm">
                        <span className="font-medium text-white/90">Progress: 75%</span>
                        <span className="text-blue-200">6/8 modules</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-white/15 to-white/5 rounded-xl p-5 border border-white/10 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-3">
                          <GraduationCap size={20} className="text-white" />
                        </div>
                        <h3 className="font-semibold text-lg">Web Development</h3>
                      </div>
                      
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '50%' }}
                          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        ></motion.div>
                      </div>
                      
                      <div className="flex justify-between mt-3 text-sm">
                        <span className="font-medium text-white/90">Progress: 50%</span>
                        <span className="text-blue-200">4/8 modules</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors duration-300"
                      >
                        View All Courses
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30"></div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 right-20 w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center"
                >
                  <BrainCircuit size={28} className="text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 left-20 w-14 h-14 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center"
                >
                  <Sparkles size={24} className="text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 top-0 h-full text-gray-100 w-1/2 transform translate-x-1/3" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 50,100 0,100" opacity="0.6" />
          </svg>
          <svg className="absolute left-0 bottom-0 h-full text-gray-50 w-1/2 transform -translate-x-1/3" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 100,100 0,100" opacity="0.4" />
          </svg>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 25%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 25%)' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
            >
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              <span className="text-sm font-semibold text-blue-700">Powerful Features</span>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 tracking-tight"
            >
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Learn Effectively</span>
            </motion.h2>
            
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Our platform provides powerful tools to enhance your learning experience and help you achieve your goals faster
            </motion.p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">AI Course Generation</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create personalized courses on any topic with our AI-powered course generator. Get structured content tailored to your learning needs.
                </p>
                
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Learn more</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">Interactive Flashcards</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Enhance your memory retention with smart flashcards that adapt to your learning pace and help you focus on what you need to review.
                </p>
                
                <div className="flex items-center text-indigo-600 font-medium">
                  <span>Learn more</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Knowledge Quizzes</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Test your understanding with automatically generated quizzes that help reinforce your learning and identify knowledge gaps.
                </p>
                
                <div className="flex items-center text-purple-600 font-medium">
                  <span>Learn more</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 4 */}

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={28} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300">Progress Tracking</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                Monitor your learning journey with detailed progress analytics and insights to help you stay motivated and on track.
                </p>
                
                <div className="flex items-center text-green-600 font-medium">
                  <span>Learn more</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>


            
            
            {/* Feature 5 */}

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="bg-amber-100 text-amber-600  w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb size={24} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-amber-600 transition-colors duration-300">Learning Recommendations</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                Get personalized recommendations for what to learn next based on your interests, progress, and learning patterns.
                </p>
                
                <div className="flex items-center text-amber-600 font-medium">
                  <span>Learn more</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>


          
            
            {/* Feature 6 */}

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="bg-rose-100 text-rose-600  w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                <Users size={24} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-rose-600  transition-colors duration-300">Customizable Experience</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                Tailor your learning environment to your preferences with customizable difficulty levels and learning paths.
                </p>
                
                <div className="flex items-center text-rose-600 font-medium">
                  <span>Learn more</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </div>
            </motion.div>


          
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-28 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 25%), radial-gradient(circle at 80% 30%, rgba(79, 70, 229, 0.03) 0%, transparent 20%)'
          }}></div>
          
          {/* Animated circles */}
          {isClient && circlePositions.map((circle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-violet-500"
              style={{
                width: circle.width,
                height: circle.height,
                top: circle.top,
                left: circle.left,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: circle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: circle.delay,
              }}
            />
          ))}
          
          {/* Dotted grid pattern */}
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
            >
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
              <span className="text-sm font-semibold text-indigo-700">Simple Process</span>
            </motion.div>
            
            <motion.h2 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 tracking-tight"
            >
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">It Works</span>
            </motion.h2>
            
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Get started with your learning journey in just a few simple steps and transform the way you learn
            </motion.p>
          </motion.div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 transform -translate-y-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-lg opacity-70 animate-pulse"></div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold relative z-10 shadow-xl shadow-blue-200">
                      1
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-2xl p-8 shadow-xl border border-blue-300 text-center h-full transform transition-transform duration-300 hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-4 text-blue-500">Create Your Course</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Enter a topic you want to learn about and our AI will generate a structured course with modules tailored to your specific needs and learning style.
                  </p>
                  <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles size={28} className="text-white" />
                  </div>
                </div>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-200 rounded-full blur-lg opacity-70 animate-pulse"></div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold relative z-10 shadow-xl shadow-yellow-200">
                      2
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 rounded-2xl p-8 shadow-xl border border-yellow-300 text-center h-full transform transition-transform duration-300 hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-4 text-yellow-500">Study & Practice</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Learn through interactive modules, test your knowledge with adaptive quizzes, and reinforce concepts with smart flashcards that evolve with your progress.
                  </p>
                  <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center">
                    <BrainCircuit size={28} className="text-white" />
                  </div>
                </div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-200 rounded-full blur-lg opacity-70 animate-pulse"></div>
                    <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold relative z-10 shadow-xl shadow-rose-200">
                      3
                    </div>
                  </div>
                </div>
                
                <div className="bg-rose-100 rounded-2xl p-8 shadow-xl border border-rose-300 text-center h-full transform transition-transform duration-300 hover:-translate-y-2">
                  <h3 className="text-2xl font-bold mb-4 text-rose-500">Track Your Progress</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Monitor your learning journey with detailed analytics and visualizations that show your growth, strengths, and areas for improvement over time.
                  </p>
                  <div className="w-16 h-16 mx-auto bg-rose-500 rounded-full flex items-center justify-center">
                    <BarChart3 size={28} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            viewport={{ once: true }}
            className="mt-36 text-center"
          >
            <Link 
              href="/openForm" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              Start Your Learning Journey
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-2 group-hover:ml-3 transition-all duration-300"
              >
                <ArrowRight size={20} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              What Our Users Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of learners who have transformed their learning experience
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "This platform has completely transformed how I learn. The AI-generated courses are incredibly well-structured and the flashcards help me retain information better than ever."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  JD
                </div>
                <div>
                  <p className="font-medium text-gray-800">Jane Doe</p>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "I've tried many learning platforms, but this one stands out. The progress tracking keeps me motivated, and the quizzes help identify areas where I need more focus."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-3">
                  JS
                </div>
                <div>
                  <p className="font-medium text-gray-800">John Smith</p>
                  <p className="text-sm text-gray-500">Data Scientist</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "As a teacher, I use this platform to create supplementary materials for my students. The AI course generator saves me hours of work and my students love the interactive elements."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">
                  AJ
                </div>
                <div>
                  <p className="font-medium text-gray-800">Alex Johnson</p>
                  <p className="text-sm text-gray-500">High School Teacher</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 opacity-30" 
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          ></div>
          
          {/* Animated light effect */}
          <motion.div
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          ></motion.div>
          
          {/* Floating particles */}
          {isClient && floatingParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50"
              style={{
                top: particle.top,
                left: particle.left,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      <span className="text-sm font-medium text-white/90">Join 2,000+ Learners</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                      Ready to Transform Your Learning Experience?
                    </h2>
                    
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                      Start creating personalized courses and track your progress today with our AI-powered learning platform.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        href="/openForm" 
                        className="group px-8 py-4 bg-white text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-white/25 flex items-center justify-center relative overflow-hidden"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center">
                          Get Started for Free
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight size={18} className="ml-2" />
                          </motion.div>
                        </span>
                      </Link>
                      
                      <Link 
                        href="/course" 
                        className="px-8 py-4 bg-transparent text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 border border-white/30 flex items-center"
                      >
                        Explore Courses
                      </Link>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="hidden md:block"
                >
                  <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl"></div>
                    
                    {/* Stats card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Learning Stats</h3>
                        <div className="bg-white/20 rounded-full px-3 py-1 text-xs text-white">Today</div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/80 to-blue-600/80 flex items-center justify-center mr-3">
                                <BookOpen size={16} className="text-white" />
                              </div>
                              <span className="text-white font-medium">Courses Completed</span>
                            </div>
                            <span className="text-2xl font-bold text-white">12</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full">
                            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1.5 rounded-full w-3/4"></div>
                          </div>
                        </div>
                        
                        <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/80 to-purple-600/80 flex items-center justify-center mr-3">
                                <BrainCircuit size={16} className="text-white" />
                              </div>
                              <span className="text-white font-medium">Flashcards Mastered</span>
                            </div>
                            <span className="text-2xl font-bold text-white">248</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full">
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full w-2/3"></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors duration-300">
                            <BarChart3 size={16} className="mr-2" />
                            View Detailed Stats
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-12 right-12 w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center"
                    >
                      <GraduationCap size={28} className="text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Learning Platform</h3>
              <p className="text-gray-400">
                Empowering learners with AI-powered tools and personalized courses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">AI Course Generation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Interactive Flashcards</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Knowledge Quizzes</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Progress Tracking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Learning Platform. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}