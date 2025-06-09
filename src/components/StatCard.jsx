import React from 'react';

const StatCard = ({ title, value, change, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      light: 'from-blue-50 to-blue-100'
    },
    green: {
      bg: 'from-green-500 to-emerald-600',
      text: 'text-green-600',
      light: 'from-green-50 to-emerald-100'
    },
    purple: {
      bg: 'from-purple-500 to-violet-600',
      text: 'text-purple-600',
      light: 'from-purple-50 to-violet-100'
    },
    orange: {
      bg: 'from-orange-500 to-red-600',
      text: 'text-orange-600',
      light: 'from-orange-50 to-red-100'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="group relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.light} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
      
      {/* Card content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {change !== undefined && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                  trend === 'up' ? 'bg-green-100 text-green-800' : 
                  trend === 'down' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trend === 'up' && (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {trend === 'down' && (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  +{change}%
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          {/* Icon */}
          <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform duration-300`}>
            <div className="scale-110">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div className={`w-full h-full bg-gradient-to-br ${colors.bg} rounded-full transform translate-x-6 -translate-y-6`}></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 