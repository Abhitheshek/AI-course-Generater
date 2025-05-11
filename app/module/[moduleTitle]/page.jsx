"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getModuleDetails, getModuleVideos } from '../../lib/geminApi';
import { trackModuleCompletion, getCourseById, getAllCourses } from '../../lib/localStorage';

import { 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Clock, 
  Award, 
  Bookmark,
  Download,
  CheckCircle,
  Share2,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  ArrowRight,
  Printer,
  CheckSquare,
  Play,
  Youtube
} from 'lucide-react';
import { use } from 'react';
import { motion } from 'framer-motion';
import CodeHighlighter from '../../components/CodeHighlighter';

export default function ModuleDetails({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const moduleTitle = decodeURIComponent(unwrappedParams.moduleTitle);
  
  const router = useRouter();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [readingProgress, setReadingProgress] = useState(0);
  const [courseId, setCourseId] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionConfetti, setShowCompletionConfetti] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [moduleVideos, setModuleVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const fetchModuleDetails = async () => {
      setLoading(true);
      try {
        const details = await getModuleDetails(moduleTitle);
        setModuleData(details);
        
        // Find which course this module belongs to
        const allCourses = getAllCourses();
        for (const course of allCourses) {
          const moduleIndex = course.modules?.findIndex(m => m.title === moduleTitle);
          if (moduleIndex !== -1 && moduleIndex !== undefined) {
            setCourseId(course._id);
            setModuleId(moduleIndex);
            
            // Check if module is already completed
            const isModuleCompleted = course.progress?.completedModules?.includes(moduleIndex);
            setIsCompleted(isModuleCompleted);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching module details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (moduleTitle) {
      fetchModuleDetails();
    }
  }, [moduleTitle]);
  
  // Fetch module-specific videos when the videos tab is selected
  useEffect(() => {
    const fetchModuleVideos = async () => {
      if (activeTab === 'videos' && moduleVideos.length === 0 && !loadingVideos) {
        setLoadingVideos(true);
        try {
          const videos = await getModuleVideos(moduleTitle);
          setModuleVideos(videos);
        } catch (error) {
          console.error('Error fetching module videos:', error);
        } finally {
          setLoadingVideos(false);
        }
      }
    };
    
    fetchModuleVideos();
  }, [activeTab, moduleTitle, moduleVideos.length, loadingVideos]);

  // Track scroll progress
  useEffect(() => {
    if (!loading && moduleData) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.body.scrollHeight;
        const scrollableDistance = fullHeight - windowHeight;
        
        if (scrollableDistance > 0) {
          const progress = Math.min(Math.ceil((scrollPosition / scrollableDistance) * 100), 100);
          setReadingProgress(progress);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [loading, moduleData]);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    // Here you could add logic to save bookmarked state to user profile
  };

  const handleMarkAsComplete = () => {
    if (courseId !== null && moduleId !== null) {
      trackModuleCompletion(courseId, moduleId);
      setIsCompleted(true);
      setShowCompletionConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowCompletionConfetti(false);
      }, 3000);
    }
  };

  const generatePDF = async () => {
    try {
      setPdfGenerating(true);
      
      // Dynamically import jsPDF and html2pdf only when needed
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Create a clean version of the content for PDF
      const createPDFContent = () => {
        // Create a container for our formatted content
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.padding = '20px';
        container.style.boxSizing = 'border-box';
        container.style.fontFamily = 'Arial, sans-serif';
        
        // Add title
        const title = document.createElement('h1');
        title.textContent = moduleData.title;
        title.style.fontSize = '24px';
        title.style.marginBottom = '20px';
        title.style.color = '#333';
        container.appendChild(title);
        
        // Process HTML content to extract structure
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = moduleData.detailedContent;
        
        // Extract headings and paragraphs
        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = tempDiv.querySelectorAll('p');
        const lists = tempDiv.querySelectorAll('ul, ol');
        
        // Add a horizontal rule
        const hr = document.createElement('hr');
        hr.style.border = 'none';
        hr.style.borderTop = '1px solid #ddd';
        hr.style.margin = '20px 0';
        container.appendChild(hr);
        
        // Add content section title
        const contentTitle = document.createElement('h2');
        contentTitle.textContent = 'Module Content';
        contentTitle.style.fontSize = '18px';
        contentTitle.style.marginBottom = '15px';
        contentTitle.style.color = '#444';
        container.appendChild(contentTitle);
        
        // Add headings
        headings.forEach(heading => {
          const h = document.createElement(heading.tagName);
          h.textContent = heading.textContent;
          h.style.marginTop = '20px';
          h.style.marginBottom = '10px';
          h.style.color = '#333';
          container.appendChild(h);
        });
        
        // Add paragraphs
        paragraphs.forEach(para => {
          const p = document.createElement('p');
          p.textContent = para.textContent;
          p.style.marginBottom = '10px';
          p.style.lineHeight = '1.5';
          p.style.color = '#555';
          container.appendChild(p);
        });
        
        // Add lists if any
        lists.forEach(list => {
          const listElement = document.createElement(list.tagName);
          listElement.style.marginLeft = '20px';
          listElement.style.marginBottom = '15px';
          
          const items = list.querySelectorAll('li');
          items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.textContent;
            li.style.marginBottom = '5px';
            listElement.appendChild(li);
          });
          
          container.appendChild(listElement);
        });
        
        // Add exercises section if available
        if (moduleData.exercises && moduleData.exercises.length > 0) {
          const exercisesTitle = document.createElement('h2');
          exercisesTitle.textContent = 'Practice Exercises';
          exercisesTitle.style.fontSize = '18px';
          exercisesTitle.style.marginTop = '30px';
          exercisesTitle.style.marginBottom = '15px';
          exercisesTitle.style.color = '#444';
          container.appendChild(exercisesTitle);
          
          moduleData.exercises.forEach((exercise, index) => {
            const exerciseTitle = document.createElement('h3');
            exerciseTitle.textContent = `${index + 1}. ${exercise.title}`;
            exerciseTitle.style.fontSize = '16px';
            exerciseTitle.style.marginTop = '15px';
            exerciseTitle.style.marginBottom = '10px';
            container.appendChild(exerciseTitle);
            
            const exerciseDesc = document.createElement('p');
            exerciseDesc.textContent = exercise.description;
            exerciseDesc.style.marginBottom = '15px';
            exerciseDesc.style.paddingLeft = '15px';
            exerciseDesc.style.borderLeft = '3px solid #ddd';
            container.appendChild(exerciseDesc);
          });
        }
        
        // Add resources section if available
        if (moduleData.resources && moduleData.resources.length > 0) {
          const resourcesTitle = document.createElement('h2');
          resourcesTitle.textContent = 'Additional Resources';
          resourcesTitle.style.fontSize = '18px';
          resourcesTitle.style.marginTop = '30px';
          resourcesTitle.style.marginBottom = '15px';
          resourcesTitle.style.color = '#444';
          container.appendChild(resourcesTitle);
          
          const resourcesList = document.createElement('ul');
          resourcesList.style.marginLeft = '20px';
          resourcesList.style.marginBottom = '15px';
          
          moduleData.resources.forEach(resource => {
            const li = document.createElement('li');
            li.textContent = `${resource.title}: ${resource.url}`;
            li.style.marginBottom = '5px';
            resourcesList.appendChild(li);
          });
          
          container.appendChild(resourcesList);
        }
        
        // Add footer
        const footer = document.createElement('div');
        footer.style.marginTop = '30px';
        footer.style.paddingTop = '15px';
        footer.style.borderTop = '1px solid #ddd';
        footer.style.fontSize = '12px';
        footer.style.color = '#777';
        footer.textContent = `${moduleData.title} - Downloaded on ${new Date().toLocaleDateString()}`;
        container.appendChild(footer);
        
        return container;
      };
      
      // Create the content
      const contentElement = createPDFContent();
      
      // Function to add text with proper wrapping and pagination
      const addTextToPDF = (text, fontSize, isTitle = false, isBold = false) => {
        let yPosition = isTitle ? margin : currentY;
        
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, isBold || isTitle ? 'bold' : 'normal');
        pdf.setTextColor(0, 0, 0);
        
        // Split text into lines that fit the page width
        const lines = pdf.splitTextToSize(text, contentWidth);
        
        // Calculate line height based on font size
        const lineHeight = fontSize * 0.5;
        const totalHeight = lines.length * lineHeight;
        
        // Check if we need a new page
        if (yPosition + totalHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Add text to PDF
        pdf.text(lines, margin, yPosition);
        
        // Return the new Y position with proper spacing
        return yPosition + totalHeight + (isTitle ? 10 : 5);
      };
      
      // Initialize current Y position
      let currentY = margin;
      
      // Add title
      currentY = addTextToPDF(moduleData.title, 24, true);
      
      // Add horizontal line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;
      
      // Add content section title
      currentY = addTextToPDF('Module Content', 18, false, true);
      
      // Extract clean text from the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = moduleData.detailedContent;
      
      // Process headings
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1));
        const fontSize = 20 - (level * 2); // h1=18, h2=16, h3=14, etc.
        
        // Add extra spacing before headings
        currentY += 5;
        
        // Check if we need a new page
        if (currentY > pageHeight - margin - 30) {
          pdf.addPage();
          currentY = margin;
        }
        
        currentY = addTextToPDF(heading.textContent.trim(), fontSize, false, true);
      });
      
      // Process paragraphs
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach(paragraph => {
        const text = paragraph.textContent.trim();
        if (!text) return; // Skip empty paragraphs
        
        // Check if we need a new page
        if (currentY > pageHeight - margin - 30) {
          pdf.addPage();
          currentY = margin;
        }
        
        currentY = addTextToPDF(text, 12);
        
        // Add extra spacing after paragraphs
        currentY += 5;
      });
      
      // Add exercises section if available
      if (moduleData.exercises && moduleData.exercises.length > 0) {
        // Add a page break before exercises
        pdf.addPage();
        currentY = margin;
        
        currentY = addTextToPDF('Practice Exercises', 18, false, true);
        currentY += 10; // Add extra spacing after section title
        
        moduleData.exercises.forEach((exercise, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - margin - 60) {
            pdf.addPage();
            currentY = margin;
          }
          
          currentY = addTextToPDF(`${index + 1}. ${exercise.title}`, 14, false, true);
          currentY += 5; // Add spacing between title and description
          currentY = addTextToPDF(exercise.description, 12);
          
          // Add spacing between exercises
          currentY += 15;
        });
      }
      
      // Add resources section if available
      if (moduleData.resources && moduleData.resources.length > 0) {
        // Check if we need a new page
        if (currentY > pageHeight - margin - 80) {
          pdf.addPage();
          currentY = margin;
        } else {
          // Add some spacing
          currentY += 20;
        }
        
        currentY = addTextToPDF('Additional Resources', 18, false, true);
        currentY += 10; // Add extra spacing after section title
        
        moduleData.resources.forEach((resource, index) => {
          // Check if we need a new page
          if (currentY > pageHeight - margin - 30) {
            pdf.addPage();
            currentY = margin;
          }
          
          currentY = addTextToPDF(`${index + 1}. ${resource.title}: ${resource.url}`, 12);
          currentY += 8; // Add spacing between resources
        });
      }
      
      // Add footer on each page
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${pageCount}`, margin, pageHeight - 10);
        pdf.text(`${moduleData.title} - Downloaded on ${new Date().toLocaleDateString()}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
      
      // Save the PDF
      pdf.save(`${moduleData.title.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again later.');
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-indigo-100"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Preparing your learning materials...</p>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="mt-4 text-red-600 font-medium">Unable to load module content</p>
          <p className="mt-2 text-gray-600 text-sm">The requested module could not be loaded. Please try again later.</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>
      
      {/* Confetti overlay for completion */}
      {showCompletionConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  top: "-10%",
                  left: `${Math.random() * 100}%`,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: 1
                }}
                animate={{
                  top: "100%",
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  ease: "easeOut"
                }}
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: [
                    "#FF6B6B", "#4ECDC4", "#FFE66D", "#1A535C", "#FF9F1C", 
                    "#7B68EE", "#3CB371", "#FF69B4", "#00CED1", "#FF7F50"
                  ][Math.floor(Math.random() * 10)]
                }}
              />
            ))}
          </div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Module Completed!</h3>
            <p className="text-gray-600">Great job! Your progress has been saved.</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex space-x-4 items-center">
            <div className="text-sm font-medium text-gray-600">
              <Clock className="inline-block h-4 w-4 mr-1" />
              <span>{readingProgress}% complete</span>
            </div>
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-full transition-colors ${bookmarked ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto md:px-4 px-2 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Module title section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-3">{moduleData.title}</h1>
                <div className="flex items-center text-indigo-100 text-sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>Learning Module</span>
                  <span className="mx-2">•</span>
                  <Award className="h-4 w-4 mr-1" />
                  <span>Core Knowledge</span>
                </div>
              </div>
              
              
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('content')}
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'content' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Module Content
              </button>
              <button 
                onClick={() => setActiveTab('exercises')}
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'exercises' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Practice Exercises
              </button>
              <button 
                onClick={() => setActiveTab('videos')}
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'videos' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Video Tutorials
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'resources' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Additional Resources
              </button>
            </nav>
          </div>
        
          {/* Content */}
          <div className="md:px-8 px-4 py-8">
            {activeTab === 'content' && (
              <div className="prose max-w-none" ref={contentRef}>
                <CodeHighlighter content={moduleData.detailedContent} />
                
                {/* Interactive elements */}
                <div className="flex  space-x-2 ">
                <button
                  onClick={generatePDF}
                  disabled={pdfGenerating}
                  className="flex items-center px-4 py-2 bg-black hover:bg-black/30 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  {pdfGenerating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
                
                {!isCompleted ? (
                  <button
                    onClick={handleMarkAsComplete}
                    className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </button>
                ) : (
                  <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </div>
                )}
              </div>
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Was this module helpful?</h3>
                  <div className="md:flex flex-col md:space-x-4 space-y-4">
                    <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Yes, it was helpful
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Provide Feedback
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
                
                {/* Next steps */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Practice Exercises</h4>
                      <p className="text-gray-600 mb-4">
                        Apply what you've learned with hands-on exercises to reinforce your knowledge.
                      </p>
                      <button 
                        onClick={() => setActiveTab('exercises')}
                        className="flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        Try exercises
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-lg p-6 border border-amber-100 hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Video Tutorials</h4>
                      <p className="text-gray-600 mb-4">
                        Watch video tutorials to see concepts in action and learn through visual examples.
                      </p>
                      <button 
                        onClick={() => setActiveTab('videos')}
                        className="flex items-center text-red-600 font-medium hover:text-red-800"
                      >
                        Watch videos
                        <Play className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100 hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Additional Resources</h4>
                      <p className="text-gray-600 mb-4">
                        Explore related materials and external resources to deepen your understanding.
                      </p>
                      <button 
                        onClick={() => setActiveTab('resources')}
                        className="flex items-center text-purple-600 font-medium hover:text-purple-800"
                      >
                        View resources
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'exercises' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Exercises</h2>
                {moduleData.exercises && moduleData.exercises.length > 0 ? (
                  <div className="space-y-8">
                    {moduleData.exercises.map((exercise, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-indigo-50 px-6 py-4 flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-800">{exercise.title}</h3>
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Exercise {index + 1}</span>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-700 mb-6">{exercise.description}</p>
                          <div className="flex justify-end">
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow-md">
                              Start Exercise
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No exercises available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no practice exercises for this module yet. Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'videos' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Video Tutorials</h2>
                
                {loadingVideos ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="flex flex-col items-center">
                      <div className="relative mx-auto h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-2 border-indigo-100"></div>
                      </div>
                      <p className="mt-4 text-gray-600">Loading video tutorials...</p>
                    </div>
                  </div>
                ) : moduleVideos && moduleVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {moduleVideos.map((video, index) => {
                      // Extract video ID from URL
                      const videoIdMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                      const videoId = videoIdMatch ? videoIdMatch[1] : null;
                      
                      return (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-100 relative">
                            {videoId ? (
                              <iframe 
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={video.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <Youtube className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {video.description || `Learn about ${moduleTitle} in this educational video.`}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{video.channelTitle || 'Educational Channel'}</span>
                              {video.publishedAt && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Show a button to find more videos */}
                    <div className="md:col-span-2 mt-4 flex justify-center">
                      <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(moduleTitle + ' tutorial')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                      >
                        <Youtube size={18} />
                        Find More Videos on YouTube
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Youtube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No videos available</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      We couldn't find any video tutorials for this module. Try searching on YouTube directly.
                    </p>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(moduleTitle + ' tutorial')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Youtube size={18} />
                      Search on YouTube
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Resources</h2>
                {moduleData.resources && moduleData.resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {moduleData.resources.map((resource, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <ExternalLink className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-2">{resource.title}</h3>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              Visit resource
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no additional resources for this module yet. Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Floating action buttons */}
          <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Scroll to top"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 transform rotate-90" />
            </button>
            
            <button 
              onClick={() => window.print()}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Print module"
            >
              <Printer className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}