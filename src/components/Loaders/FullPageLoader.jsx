'use client';

import React from 'react';
import { Spin } from 'antd';

const FullPageLoader = ({ 
  message = "Loading...", 
  showMessage = true,
  variant = "default" // default, minimal, branded
}) => {
  const getLoaderContent = () => {
    switch (variant) {
      case "minimal":
        return (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        );
      
      case "branded":
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Logo/Brand */}
            <div className="text-6xl text-blue-600 mb-4">
              <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            
            {/* Animated dots */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {showMessage && (
              <p className="text-gray-600 text-lg font-medium mt-4">{message}</p>
            )}
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Spin size="large" />
            {showMessage && (
              <p className="text-gray-600 text-lg font-medium">{message}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {getLoaderContent()}
      </div>
    </div>
  );
};

export default FullPageLoader;