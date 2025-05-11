"use client";
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Link from 'next/link';
import { Play, BookOpen, Clock, ChevronRight, ExternalLink, BrainCircuit, CheckCircle2, HelpCircle, Lightbulb, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CourseDisplay({ courseData }) {
    const [selectedModule, setSelectedModule] = useState(courseData.modules[0]);
    const router = useRouter();
    const [thumbnailErrors, setThumbnailErrors] = useState({});

    // Function to extract YouTube video ID from URL
    const getYoutubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Function to get the appropriate thumbnail URL based on previous errors
    const getThumbnailUrl = (videoId, index) => {
        if (!videoId) return null;

        // If we've already tried the high quality and it failed, use standard quality
        if (thumbnailErrors[index]) {
            return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }

        // Otherwise try high quality first
        return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    };

    const handleThumbnailError = (index, videoId) => {
        // Mark this index as having an error with high quality
        setThumbnailErrors(prev => ({
            ...prev,
            [index]: true
        }));
    };

    const handleQuizStart = () => {
        const currentUrl = window.location.href;
        // Navigate to quiz page with module data
        router.push(`/quiz/${encodeURIComponent(selectedModule.title)}?moduleData=${encodeURIComponent(JSON.stringify(selectedModule))}&returnUrl=${encodeURIComponent(currentUrl)}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Course Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white md:p-10 p-4">
                <h2 className="text-3xl font-bold tracking-tight">{courseData.title}</h2>
                <p className="mt-4 text-violet-50 max-w-3xl opacity-90 leading-relaxed">{courseData.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-8">
                    {courseData.difficultyLevel && (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-sm font-medium backdrop-blur-sm">
                            {courseData.difficultyLevel.charAt(0).toUpperCase() + courseData.difficultyLevel.slice(1)}
                        </span>
                    )}
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-sm font-medium backdrop-blur-sm">
                        <Clock size={14} className="mr-1.5" />
                        {courseData.modules.length} modules
                    </span>
                </div>
            </div>

            {/* Recommended Videos */}
            {courseData.recommendedVideos && courseData.recommendedVideos.length > 0 && (
                <div className="p-10 bg-gray-50/50">
                    <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                        <Play size={20} className="mr-2.5 text-violet-600" />
                        Recommended Videos
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {courseData.recommendedVideos.map((video, index) => {
                            const videoId = getYoutubeVideoId(video.url);

                            return (
                                <div
                                    key={index}
                                    className="bg-gray-100 shadow-md rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                                >
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block relative aspect-video overflow-hidden"
                                    >
                                        {videoId ? (
                                            <div className="relative w-full h-full">
                                                {/* Using standard img tag with multiple fallbacks */}
                                                <img
                                                    src={thumbnailErrors[index]
                                                        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                                                        : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={() => handleThumbnailError(index, videoId)}
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                                                        <Play size={24} className="text-violet-600 ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                                    <Play size={24} className="text-violet-600 ml-1" />
                                                </div>
                                            </div>
                                        )}
                                    </a>
                                    <div className="p-5">
                                        <p className="font-medium text-gray-800 line-clamp-2 text-lg">{video.title}</p>
                                        <a
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center text-violet-600 hover:text-violet-800 text-sm font-medium group"
                                        >
                                            Watch on YouTube
                                            <ExternalLink size={14} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Course Modules */}
            <div className="grid md:grid-cols-3">
                <div className="md:col-span-1 border-r border-gray-100 bg-gray-50/30">
                    <div className="p-6 bg-white sticky top-0 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                            <BookOpen size={18} className="mr-2.5 text-violet-600" />
                            Course Modules
                        </h3>
                    </div>
                    <ul className="divide-y divide-gray-100 p-2 rounded-xl my-1">
                        {courseData.modules.map((module, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setSelectedModule(module)}
                                    className={`w-full text-left px-6 py-4 flex items-center rounded-2xl my-1 bg-gray-100 shadow-md justify-between hover:bg-violet-50/50 transition duration-200
                    ${selectedModule.title === module.title
                                            ? 'bg-violet-50 border-l-4 border-violet-600 font-medium text-violet-800'
                                            : 'border-l-4 border-transparent'}`}
                                >
                                    <span className="line-clamp-1">{module.title}</span>
                                    <ChevronRight
                                        size={18}
                                        className={`text-gray-400 transition-transform duration-200 ${selectedModule.title === module.title ? 'transform rotate-90 text-violet-600' : ''
                                            }`}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2 p-5">
                    <div className='bg-gray-50 rounded-xl shadow-md p-6'>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedModule.title}</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">{selectedModule.briefDescription || selectedModule.content}</p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                href={`/module/${encodeURIComponent(selectedModule.title)}`}
                                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition shadow-md hover:shadow-lg flex items-center justify-center group"
                            >
                                Explore Module
                                <ChevronRight size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            <button
                                onClick={handleQuizStart}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center group"
                            >
                                Take Quiz
                                <BrainCircuit size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Quiz Card */}
                    <div className="mt-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleQuizStart}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="bg-indigo-600 p-3 rounded-lg text-white mr-4">
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">Test Your Knowledge</h4>
                                    <p className="text-gray-600 mt-1">Take an AI-generated quiz on {selectedModule.title}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg flex items-center">
                                <CheckCircle2 size={18} className="text-green-500 mr-2" />
                                <span className="text-sm text-gray-700">Multiple choice questions</span>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg flex items-center">
                                <HelpCircle size={18} className="text-amber-500 mr-2" />
                                <span className="text-sm text-gray-700">True/False questions</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-xs font-medium text-indigo-800">
                                AI-Generated • Adaptive • {courseData.difficultyLevel ? (courseData.difficultyLevel.charAt(0).toUpperCase() + courseData.difficultyLevel.slice(1)) : 'Intermediate'} Level
                            </span>
                        </div>
                    </div>
       
                    {/* Flashcard Card */}
                    <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => {
                        const currentUrl = window.location.href;
                        router.push(`/flashcards/${encodeURIComponent(selectedModule.title)}?moduleData=${encodeURIComponent(JSON.stringify(selectedModule))}&returnUrl=${encodeURIComponent(currentUrl)}`);
                    }}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="bg-amber-500 p-3 rounded-lg text-white mr-4">
                                    <Lightbulb size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">Study Flashcards</h4>
                                    <p className="text-gray-600 mt-1">Review key concepts from {selectedModule.title}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg flex items-center">
                                <Lightbulb size={18} className="text-amber-500 mr-2" />
                                <span className="text-sm text-gray-700">Interactive flashcards</span>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg flex items-center">
                                <RotateCcw size={18} className="text-amber-500 mr-2" />
                                <span className="text-sm text-gray-700">AI-generated content</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-xs font-medium text-amber-800">
                                Study Aid • Spaced Repetition • {courseData.difficultyLevel ? (courseData.difficultyLevel.charAt(0).toUpperCase() + courseData.difficultyLevel.slice(1)) : 'Intermediate'} Level
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}