"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronDown, 
  Sparkles, 
  BookCheck, 
  BookX, 
  Loader2, 
  Zap, 
  Search,
  Lightbulb,
  Brain,
  GraduationCap,
  Rocket,
  Target,
  ArrowRight
} from 'lucide-react';

export default function CourseForm({ onSubmit, loading }) {
  const [courseTitle, setCourseTitle] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [suggestions, setSuggestions] = useState([
    "Machine Learning Fundamentals",
    "Web Development with React",
    "Python for Data Science",
    "JavaScript for Beginners",
    "Cloud Computing Essentials",
    "Data Structures and Algorithms",
    "Mobile App Development"
  ]);

  const difficultyOptions = [
    { 
      value: 'beginner', 
      label: 'Beginner', 
      icon: <BookOpen size={24} />, 
      color: 'from-blue-400 to-blue-500', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      description: 'Perfect for newcomers starting their journey',
      features: ['Foundational concepts', 'Step-by-step guidance', 'Basic terminology']
    },
    { 
      value: 'intermediate', 
      label: 'Intermediate', 
      icon: <BookCheck size={24} />, 
      color: 'from-indigo-400 to-indigo-500', 
      bgColor: 'bg-indigo-50', 
      borderColor: 'border-indigo-200',
      description: 'For those with foundational knowledge',
      features: ['Practical applications', 'Deeper concepts', 'Real-world examples']
    },
    { 
      value: 'advanced', 
      label: 'Advanced', 
      icon: <BookX size={24} />, 
      color: 'from-purple-400 to-purple-500', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200',
      description: 'Deep dive for experienced learners',
      features: ['Complex topics', 'Expert techniques', 'Cutting-edge content']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    onSubmit(courseTitle, difficultyLevel);
  };

  const nextStep = () => {
    if (activeStep < 2 && courseTitle.trim()) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
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

  const pageVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: -300, opacity: 0, transition: { ease: "easeInOut" } }
  };

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${activeStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="text-xs mt-2 font-medium text-gray-600">Course Topic</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="text-xs mt-2 font-medium text-gray-600">Difficulty</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="text-xs mt-2 font-medium text-gray-600">Generate</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {activeStep === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Course Title Input */}
              <div className="mb-8">
                <div className="text-center mb-6">
                  <GraduationCap size={40} className="mx-auto text-blue-600 mb-3" />
                  <h2 className="text-2xl font-bold text-gray-800">What would you like to learn?</h2>
                  <p className="text-gray-600 mt-2">Enter a topic or subject you're interested in exploring</p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <div 
                      className={`flex items-center bg-white rounded-xl overflow-hidden border-2 transition-all duration-300
                        ${isInputFocused ? 'border-blue-500 shadow-lg ring-4 ring-blue-100' : 'border-gray-200'}`}
                    >
                      <div className="pl-5 py-4">
                        <Search size={22} className={`transition-colors duration-300 ${isInputFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        id="courseTitle"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="e.g. Machine Learning, Web Development, Python Programming"
                        className="w-full px-4 py-4 bg-transparent focus:outline-none text-gray-700 text-lg"
                        required
                      />
                      <div className="pr-5">
                        <Zap size={22} className={`transition-colors duration-300 ${isInputFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                    </div>

                    {/* Course suggestions */}
                    <AnimatePresence>
                      {isInputFocused && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-3 text-sm overflow-hidden"
                        >
                          <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100 mb-2">
                            <Lightbulb size={16} className="text-amber-500" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Popular Topics</p>
                          </div>
                          
                          <div className="max-h-64 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                              <motion.div 
                                key={index}
                                onClick={() => {
                                  setCourseTitle(suggestion);
                                  setIsInputFocused(false);
                                }}
                                whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
                                className="px-4 py-3 cursor-pointer transition-colors flex items-center group"
                              >
                                <span className="w-2 h-2 rounded-full bg-blue-400 mr-3 group-hover:scale-125 transition-transform"></span>
                                <span className="text-gray-700">{suggestion}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={nextStep}
                      disabled={!courseTitle.trim()}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md 
                        hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center"
                    >
                      <span>Continue</span>
                      <ArrowRight size={18} className="ml-2" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Difficulty Level Cards */}
              <div className="mb-8">
                <div className="text-center mb-6">
                  <Target size={40} className="mx-auto text-blue-600 mb-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Select Difficulty Level</h2>
                  <p className="text-gray-600 mt-2">Choose the appropriate level for your learning journey</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                  {difficultyOptions.map((option) => {
                    const baseColor = option.value === 'beginner' ? 'blue' : option.value === 'intermediate' ? 'indigo' : 'purple';
                    
                    return (
                      <motion.div
                        key={option.value}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDifficultyLevel(option.value)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300
                          ${difficultyLevel === option.value 
                            ? `border-2 border-${baseColor}-500 shadow-lg` 
                            : `border border-gray-200 hover:border-${baseColor}-300`}`}
                      >
                        <div className={`p-6 ${option.bgColor} h-full`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white shadow-md`}>
                              {option.icon}
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center
                              ${difficultyLevel === option.value 
                                ? `bg-${baseColor}-500` 
                                : 'border-2 border-gray-300 bg-white'}`}
                            >
                              {difficultyLevel === option.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{option.label}</h3>
                          <p className="text-gray-600 mb-4 text-sm">{option.description}</p>
                          
                          <div className="space-y-2 mt-4">
                            {option.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${baseColor}-400 mr-2`}></div>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {difficultyLevel === option.value && (
                          <div className={`absolute top-0 right-0 w-0 h-0 
                            border-t-[40px] border-r-[40px] 
                            border-t-transparent border-r-${baseColor}-500`}>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={prevStep}
                    className="md:px-6 px-2  md:py-3 py-2 text-sm md:text-lg bg-gray-200 text-gray-700 font-medium rounded-lg
                      hover:bg-gray-300 transition-all duration-300
                      flex items-center justify-center"
                  >
                    <ChevronDown size={18} className="mr-2 md:text-lg text-sm rotate-90" />
                    <span>Back</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="md:px-6 px-2  md:py-3 py-3 text-sm md:text-lg bg-blue-600 text-white font-medium rounded-lg shadow-md 
                      hover:bg-blue-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center justify-center min-w-[150px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin mr-2" />
                        <span>Creating Course...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} className="mr-2" />
                        <span>Generate Course</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Course Preview */}
      {courseTitle && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Rocket size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-700">Course Preview</h3>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-4 flex-wrap overflow-clip">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Brain size={24} />
              </div>
              <div>
                <h4 className="md:text-xl text-lg  font-bold text-gray-800">{courseTitle || "Your New Course"}</h4>
                <p className="text-gray-600 mt-1">
                  {difficultyLevel === 'beginner' && 'A beginner-friendly introduction to help you build a solid foundation.'}
                  {difficultyLevel === 'intermediate' && 'An intermediate course designed to expand your knowledge and skills.'}
                  {difficultyLevel === 'advanced' && 'An advanced exploration of complex concepts and techniques.'}
                </p>
                
                <div className="flex items-center gap-3 mt-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${difficultyLevel === 'beginner' ? 'bg-blue-100 text-blue-700' : 
                      difficultyLevel === 'intermediate' ? 'bg-indigo-100 text-indigo-700' : 
                      'bg-purple-100 text-purple-700'}`}>
                    {difficultyOptions.find(opt => opt.value === difficultyLevel)?.label}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    AI Generated
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Interactive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}