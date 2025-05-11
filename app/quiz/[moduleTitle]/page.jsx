// app/quiz/[moduleTitle]/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArrowLeft, CheckCircle, XCircle, Loader2, RefreshCw, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default function QuizPage({ params }) {
  // Add router for navigation
  const router = useRouter();
  
  // Properly unwrap params using React.use()
  const unwrappedParams = use(params);
  const moduleTitle = decodeURIComponent(unwrappedParams.moduleTitle);
  
  const searchParams = useSearchParams();
  const moduleData = searchParams.get('moduleData') ? JSON.parse(decodeURIComponent(searchParams.get('moduleData'))) : null;
  
  // Get the complete return URL from URL params, default to '/course'
  const returnUrl = searchParams.get('returnUrl') ? decodeURIComponent(searchParams.get('returnUrl')) : '/course';
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (moduleTitle) {
      generateQuiz();
    }
  }, [moduleTitle]);
  
  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
    
    try {
      const prompt = `
        Create a comprehensive quiz about "${moduleTitle}".
        
        The quiz should test knowledge on the following topic:
        ${moduleData?.briefDescription || moduleTitle}
        
        Return the response as a JSON object with the following structure:
        {
          "title": "Quiz title related to the module",
          "description": "Brief description of what this quiz covers",
          "questions": [
            {
              "question": "Question text here?",
              "type": "multiple-choice", // or "true-false"
              "options": ["Option A", "Option B", "Option C", "Option D"], // Include for multiple-choice
              "correctAnswer": "Option A", // The correct answer
              "explanation": "Brief explanation of why this is the correct answer"
            },
            // More questions...
          ]
        }
        
        Create 10 questions total:
        - 7 multiple-choice questions with 4 options each
        - 3 true-false questions with options ["True", "False"]
        
        Make sure the questions cover different aspects of the topic and vary in difficulty.
        Ensure all questions are factually accurate and related to the topic.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/);
      let quizData;
      
      if (jsonMatch && jsonMatch[1]) {
        quizData = JSON.parse(jsonMatch[1]);
      } else {
        try {
          quizData = JSON.parse(text);
        } catch (e) {
          throw new Error("Failed to parse quiz data");
        }
      }
      
      setQuiz(quizData);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore((correctAnswers / quiz.questions.length) * 100);
  };
  
  // Function to navigate back to course page with full URL including query params
  const backToCourse = () => {
    router.push(returnUrl);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Quiz</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI is creating personalized questions about {moduleTitle}...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={generateQuiz}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </button>
            
            <button
              onClick={backToCourse}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!quiz) {
    return null;
  }
  
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-8 text-center">
            <Award size={64} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Quiz Results</h2>
            <p className="text-indigo-100 mb-4">You've completed the quiz on {moduleTitle}</p>
            <div className="text-5xl font-bold mb-2">{Math.round(score)}%</div>
            <p className="text-indigo-100">
              {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep learning!'}
            </p>
          </div>
          
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6">Question Review</h3>
            
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" size={20} />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{question.question}</p>
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600">Your answer: <span className={selectedAnswers[index] === question.correctAnswer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{selectedAnswers[index] || "Not answered"}</span></p>
                        <p className="text-gray-600">Correct answer: <span className="text-green-600 font-medium">{question.correctAnswer}</span></p>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={generateQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Take New Quiz
              </button>
              
              <button
                onClick={backToCourse}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={backToCourse}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Course
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-6">
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <p className="mt-2 text-indigo-100">{quiz.description}</p>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
              <div className="bg-indigo-100 h-2 rounded-full flex-1 mx-4">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h3>
              
              <div className="space-y-3">
                {currentQuestion.type === "multiple-choice" ? (
                  currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedAnswers[currentQuestionIndex] === option
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestionIndex] === option
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestionIndex] === option && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswerSelect("True")}
                      className={`flex-1 p-4 rounded-lg border transition-all ${
                        selectedAnswers[currentQuestionIndex] === "True"
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestionIndex] === "True"
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestionIndex] === "True" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        True
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAnswerSelect("False")}
                      className={`flex-1 p-4 rounded-lg border transition-all ${
                        selectedAnswers[currentQuestionIndex] === "False"
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestionIndex] === "False"
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestionIndex] === "False" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        False
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`md:px-3 px-3 md:py-3 py-2 md:text-lg text-sm rounded-lg flex items-center justify-center ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition'
                }`}
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Previous
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={!isAnswerSelected}
                className={`md:px-6 px-3 md:text-lg text-sm  md:py-3 py-2 rounded-lg flex items-center justify-center ${
                  !isAnswerSelected
                    ? 'bg-indigo-300 text-white cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md hover:shadow-lg'
                }`}
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                {!isLastQuestion && <ChevronRight size={16} className="ml-1.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
