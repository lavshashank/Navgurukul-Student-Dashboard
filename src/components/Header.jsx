import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, subtitle, activeTab }) => {
  const { user } = useAuth();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-white via-blue-50 to-orange-50 border-b border-blue-200 px-4 lg:px-6 py-3 lg:py-6 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Title Section - Mobile Optimized */}
        <div className="flex-1 min-w-0 pl-16 lg:pl-0 pr-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {activeTab === 'dashboard' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                  Live
                </span>
              )}
            </div>
            <p className="text-gray-600 text-xs lg:text-base truncate lg:whitespace-normal">{subtitle}</p>
          </div>
        </div>

        {/* User Menu - Horizontal Layout */}
        <div className="flex items-center space-x-3">
          {/* User greeting */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {getGreeting()}!
            </p>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </p>
          </div>
          
          {/* Avatar */}
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
            <span className="text-white text-sm lg:text-base font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 