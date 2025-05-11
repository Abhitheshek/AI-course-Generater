// app/flashcards/[moduleTitle]/page.jsx
"use client";
import { useSearchParams } from 'next/navigation';
import FlashcardDeck from '../../components/FlashcardDeck';
import { use } from 'react';

export default function FlashcardsPage({ params }) {
  // Properly unwrap params using React.use()
  const unwrappedParams = use(params);
  const moduleTitle = decodeURIComponent(unwrappedParams.moduleTitle);
  
  const searchParams = useSearchParams();
  const moduleData = searchParams.get('moduleData') ? JSON.parse(decodeURIComponent(searchParams.get('moduleData'))) : null;
  
  // Get the return path from URL params, default to '/course'
  const returnUrl = searchParams.get('returnUrl') ? decodeURIComponent(searchParams.get('returnUrl')) : '/course';
  
  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 text-red-600 p-4 rounded-full inline-flex mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Missing Module Data</h2>
          <p className="text-gray-600 mb-6">We couldn't find the module data needed to generate flashcards.</p>
          <a 
            href={returnUrl}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg inline-flex items-center justify-center"
          >
            Back to Course
          </a>
        </div>
      </div>
    );
  }
  
  return <FlashcardDeck moduleData={moduleData} returnUrl={returnUrl} />;
}
