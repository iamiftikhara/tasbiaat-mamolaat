'use client';

import React from 'react';
import { Spin } from 'antd';

const ComponentLoader = ({ 
  loading = false,
  children,
  message = "جاري تحميل البيانات...",
  showMessage = true,
  overlay = true,
  size = "default", // small, default, large
  variant = "spinner" // spinner, dots, pulse
}) => {
  const getLoaderSize = () => {
    switch (size) {
      case "small": return "small";
      case "large": return "large";
      default: return "default";
    }
  };

  const getLoaderContent = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case "pulse":
        return (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        );
      
      default:
        return <Spin size={getLoaderSize()} />;
    }
  };

  if (!loading) {
    return children;
  }

  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            {getLoaderContent()}
            {showMessage && (
              <p className="text-gray-600 text-sm mt-2">{message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Non-overlay mode - replace content entirely
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        {getLoaderContent()}
        {showMessage && (
          <p className="text-gray-600 text-sm mt-2">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ComponentLoader;