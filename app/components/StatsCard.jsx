import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, icon, description, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-50 flex-shrink-0">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span className="font-medium text-green-600">{trend.value}</span>
            <span className="text-gray-500 ml-1">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;