import React from 'react';
import Link from 'next/link';

const EmptyStateCard = ({ title, description, icon, linkText, linkHref }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center h-64">
      <div className="p-3 bg-blue-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {linkText && linkHref && (
        <Link 
          href={linkHref}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
};

export default EmptyStateCard;