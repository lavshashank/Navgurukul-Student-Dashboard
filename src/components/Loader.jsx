import React from 'react';

const Loader = ({ text = "Loading...", size = "large" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        {/* NavGurukul Logo with Animation */}
        <div className="mx-auto mb-6 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          {/* Animated Ring */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NavGurukul</h2>
        <p className="text-gray-600 mb-4">{text}</p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Inline Loader for components
export const InlineLoader = ({ text = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <div className={`${sizeClasses[size]} border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin`}></div>
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
};

export default Loader; 