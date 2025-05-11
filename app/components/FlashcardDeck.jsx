// app/components/FlashcardDeck.jsx
"use client";
import { useState, useEffect } from 'react';
import { Lightbulb, RotateCcw, ArrowRight, ArrowLeft, ChevronLeft, CheckCircle, XCircle, BookOpen, Award, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function FlashcardDeck({ moduleData, returnUrl }) {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [studyMode, setStudyMode] = useState('all'); // 'all', 'known', 'unknown'
  const [knownCards, setKnownCards] = useState({});
  const [showAllCards, setShowAllCards] = useState(false);
  const [studyStats, setStudyStats] = useState({
    totalReviewed: 0,
    knownCount: 0,
    reviewCount: 0,
    streakCount: 0
  });

  useEffect(() => {
    // Validate moduleData to prevent JSON parsing errors
    if (!moduleData || typeof moduleData !== 'object') {
      setError("Invalid module data. Please go back and try again.");
      setIsLoading(false);
    }
  }, [moduleData]);
  
  // Generate flashcards using Gemini AI
  useEffect(() => {
    generateFlashcards();
  }, [moduleData]);
  
  const generateFlashcards = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentFlashcardIndex(0);
    setIsFlipped(false);
    setKnownCards({});
    setStudyStats({
      totalReviewed: 0,
      knownCount: 0,
      reviewCount: 0,
      streakCount: 0
    });
    
    try {
      const prompt = `
        Create 10 flashcards for studying "${moduleData.title}".
        
        The flashcards should cover key concepts from this module description:
        ${moduleData.briefDescription}
        
        Return the response as a JSON array with the following structure:
        [
          {
            "front": "Question or concept on the front of the flashcard",
            "back": "Answer or explanation on the back of the flashcard"
          },
          // More flashcards...
        ]
        
        Make sure the flashcards:
        - Cover different aspects of the topic
        - Include key terms, definitions, and concepts
        - Are concise but informative
        - Are factually accurate
        - Vary in difficulty
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/);
      let flashcardsData;
      
      if (jsonMatch && jsonMatch[1]) {
        flashcardsData = JSON.parse(jsonMatch[1]);
      } else {
        try {
          flashcardsData = JSON.parse(text);
        } catch (e) {
          throw new Error("Failed to parse flashcard data");
        }
      }
      
      setFlashcards(flashcardsData);
      updateProgress(0, flashcardsData.length);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError("Failed to generate flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Flashcard navigation functions
  const nextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      const newIndex = currentFlashcardIndex + 1;
      setCurrentFlashcardIndex(newIndex);
      setIsFlipped(false);
      updateProgress(newIndex, flashcards.length);
    }
  };
  
  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      const newIndex = currentFlashcardIndex - 1;
      setCurrentFlashcardIndex(newIndex);
      setIsFlipped(false);
      updateProgress(newIndex, flashcards.length);
    }
  };
  
  const flipFlashcard = () => {
    setIsFlipped(!isFlipped);
  };
  
  const updateProgress = (current, total) => {
    setProgress(Math.round((current / (total - 1)) * 100));
  };
  
  const markCard = (known) => {
    const wasKnownBefore = knownCards[currentFlashcardIndex];
    
    // Update known cards state
    setKnownCards(prev => ({
      ...prev,
      [currentFlashcardIndex]: known
    }));
    
    // Update study stats
    setStudyStats(prev => {
      const newStats = { ...prev };
      
      // If this is the first time marking this card
      if (wasKnownBefore === undefined) {
        newStats.totalReviewed += 1;
      }
      
      // Update known/review counts based on new status
      if (known) {
        if (wasKnownBefore === false) newStats.reviewCount -= 1;
        if (wasKnownBefore !== true) newStats.knownCount += 1;
        newStats.streakCount += 1;
      } else {
        if (wasKnownBefore === true) newStats.knownCount -= 1;
        if (wasKnownBefore !== false) newStats.reviewCount += 1;
        newStats.streakCount = 0;
      }
      
      return newStats;
    });
    
    // Automatically move to next card
    nextFlashcard();
  };
  
  const getFilteredFlashcards = () => {
    if (studyMode === 'all') return flashcards;
    
    return flashcards.filter((_, index) => {
      const isKnown = knownCards[index] === true;
      return studyMode === 'known' ? isKnown : !isKnown;
    });
  };
  
  const getCurrentCardIndex = () => {
    if (studyMode === 'all') return currentFlashcardIndex;
    
    // Find the actual index in the filtered list
    const filteredCards = getFilteredFlashcards();
    const actualCard = flashcards[currentFlashcardIndex];
    return filteredCards.findIndex(card => card === actualCard);
  };
  
  const handleBackToCourse = () => {
    try {
      // Check if returnUrl is valid
      if (typeof returnUrl === 'string' && returnUrl.trim() !== '') {
        router.push(returnUrl);
      } else {
        // Default fallback if returnUrl is not provided or invalid
        router.push('/course');
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Show an error message to the user instead of crashing
      setError("Failed to navigate back to course. Please try again or refresh the page.");
    }
  };
  
  const jumpToCard = (index) => {
    setCurrentFlashcardIndex(index);
    setIsFlipped(false);
    updateProgress(index, flashcards.length);
    setShowAllCards(false);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Flashcards</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI is creating personalized flashcards for {moduleData.title}...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 text-red-600 p-4 rounded-full inline-flex mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={generateFlashcards}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <RotateCcw size={16} className="mr-2" />
              Try Again
            </button>
            
            <button
              onClick={handleBackToCourse}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const filteredFlashcards = getFilteredFlashcards();
  const currentCardNumber = getCurrentCardIndex() + 1;
  const totalFilteredCards = filteredFlashcards.length;
  
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-amber-100 text-amber-600 p-4 rounded-full inline-flex mx-auto mb-6">
            <Lightbulb size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Flashcards Available</h2>
          <p className="text-gray-600 mb-6">We couldn't find any flashcards for this module.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={generateFlashcards}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <Lightbulb size={16} className="mr-2" />
              Generate Flashcards
            </button>
            
            <button
              onClick={handleBackToCourse}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left sidebar - Stats and controls */}
        <div className="lg:w-1/4">
          <div className="sticky top-8">
            <button 
              onClick={handleBackToCourse}
              className="mb-6 flex items-center text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Course
            </button>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BookOpen size={20} className="mr-2 text-amber-500" />
                {moduleData.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{moduleData.briefDescription}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Progress</span>
                  <span className="text-amber-600 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Award size={20} className="mr-2 text-amber-500" />
                Study Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">{studyStats.totalReviewed}</div>
                  <div className="text-xs text-gray-600">Cards Reviewed</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{studyStats.knownCount}</div>
                  <div className="text-xs text-gray-600">Known</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">{studyStats.reviewCount}</div>
                  <div className="text-xs text-gray-600">To Review</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{studyStats.streakCount}</div>
                  <div className="text-xs text-gray-600">Current Streak</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <RefreshCw size={20} className="mr-2 text-amber-500" />
                Study Mode
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setStudyMode('all')}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                    studyMode === 'all' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-amber-100 border border-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    All Cards
                  </span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-md text-xs">
                    {flashcards.length}
                  </span>
                </button>
                
                <button 
                  onClick={() => setStudyMode('known')}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                    studyMode === 'known' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-green-100 border border-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Known
                  </span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-md text-xs">
                    {Object.values(knownCards).filter(Boolean).length}
                  </span>
                </button>
                
                <button 
                  onClick={() => setStudyMode('unknown')}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                    studyMode === 'unknown' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-red-100 border border-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    <XCircle size={16} className="mr-2" />
                    To Review
                  </span>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-md text-xs">
                    {flashcards.length - Object.values(knownCards).filter(Boolean).length}
                  </span>
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={generateFlashcards}
                  className="w-full px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Generate New Cards
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
            <button
              onClick={() => setShowAllCards(!showAllCards)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
            >
              {showAllCards ? 'Hide All Cards' : 'View All Cards'}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {showAllCards ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {flashcards.map((card, index) => (
                  <div 
                    key={index}
                    onClick={() => jumpToCard(index)}
                    className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition border-l-4 ${
                      knownCards[index] === true 
                        ? 'border-l-green-500' 
                        : knownCards[index] === false 
                          ? 'border-l-red-500' 
                          : 'border-l-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                        Card {index + 1}
                      </span>
                      {knownCards[index] !== undefined && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          knownCards[index] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {knownCards[index] ? 'Known' : 'Review'}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-gray-800 mb-2 line-clamp-3">{card.front}</p>
                    <p className="text-xs text-gray-500">Click to study this card</p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Flashcard */}
                <div className="relative h-96 w-full perspective-1000">
                  <div 
                    className="relative w-full h-full transition-all duration-700 transform-style-preserve-3d cursor-pointer"
                    onClick={flipFlashcard}
                    style={{ 
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d' 
                    }}
                  >
                    {/* Front of card */}
                    <div 
                      className="absolute w-full h-full backface-hidden bg-gradient-to-br from-amber-10 0 to-white rounded-2xl p-8 flex flex-col justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="absolute top-6 right-6 bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-full">
                        {currentCardNumber}/{totalFilteredCards}
                      </div>
                      
                      <div className="absolute top-6 left-6">
                        {knownCards[currentFlashcardIndex] === true ? (
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                            <CheckCircle size={16} className="mr-1" />
                            Known
                          </span>
                        ) : knownCards[currentFlashcardIndex] === false ? (
                          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                            <XCircle size={16} className="mr-1" />
                            To Review
                          </span>
                        ) : null}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-amber-600 text-sm uppercase font-bold tracking-wider mb-4">Question</h3>
                        <p className="text-center text-2xl font-medium text-gray-800">{flashcards[currentFlashcardIndex]?.front}</p>
                      </div>
                      
                      <div className="absolute bottom-6 left-0 right-0 text-center">
                        <p className="text-center text-sm text-gray-500 flex items-center justify-center">
                          <span className="inline-block border border-gray-300 rounded-md px-2 py-1 text-xs mr-2">Tap</span>
                          to reveal answer
                        </p>
                      </div>
                    </div>
                    
                    {/* Back of card */}
                    <div 
                      className="absolute w-full h-full backface-hidden bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 flex flex-col justify-center"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="absolute top-6 right-6 bg-amber-200 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-full">
                        {currentCardNumber}/{totalFilteredCards}
                      </div>
                      
                      <div className="absolute top-6 left-6">
                        {knownCards[currentFlashcardIndex] === true ? (
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                            <CheckCircle size={16} className="mr-1" />
                            Known
                          </span>
                        ) : knownCards[currentFlashcardIndex] === false ? (
                          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                            <XCircle size={16} className="mr-1" />
                            To Review
                          </span>
                        ) : null}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-amber-700 text-sm uppercase font-bold tracking-wider mb-4">Answer</h3>
                        <p className="text-center text-xl text-gray-800">{flashcards[currentFlashcardIndex]?.back}</p>
                      </div>
                      
                      <div className="absolute bottom-6 left-0 right-0 text-center">
                        <p className="text-center text-sm text-gray-600 flex items-center justify-center">
                          <span className="inline-block border border-gray-300 rounded-md px-2 py-1 text-xs mr-2">Tap</span>
                          to see question
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation and action controls */}
                <div className="p-6 border-t border-gray-100">
                  {/* Navigation controls */}
                  <div className="flex justify-between items-center gap-4 mb-6">
                    <button
                      onClick={prevFlashcard}
                      disabled={currentFlashcardIndex === 0}
                      className={`p-4 rounded-full ${currentFlashcardIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
                    >
                      <ArrowLeft size={24} />
                    </button>
                    
                    <div className="text-center">
                      <span className="text-gray-600">Card {currentCardNumber} of {totalFilteredCards}</span>
                    </div>
                    
                    <button
                      onClick={nextFlashcard}
                      disabled={currentFlashcardIndex === flashcards.length - 1}
                      className={`p-4 rounded-full ${currentFlashcardIndex === flashcards.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                  
                  {/* Knowledge marking buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => markCard(false)}
                      className="px-6 py-4 bg-white border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition flex-1 max-w-xs flex items-center justify-center"
                    >
                      <ThumbsDown size={20} className="mr-2" />
                      Need to Review
                    </button>
                    
                    <button
                      onClick={() => markCard(true)}
                      className="px-6 py-4 bg-white border-2 border-green-300 text-green-600 rounded-xl hover:bg-green-50 transition flex-1 max-w-xs flex items-center justify-center"
                    >
                      <ThumbsUp size={20} className="mr-2" />
                      Got It!
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-8">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
