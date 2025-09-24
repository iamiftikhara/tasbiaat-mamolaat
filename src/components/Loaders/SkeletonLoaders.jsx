'use client';

import React from 'react';

// Base skeleton component
const SkeletonBase = ({ className = "", children, animate = true }) => (
  <div className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}>
    {children}
  </div>
);

// Card skeleton
export const CardSkeleton = ({ showHeader = true, showFooter = false }) => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    {showHeader && (
      <div className="space-y-2">
        <SkeletonBase className="h-6 w-3/4" />
        <SkeletonBase className="h-4 w-1/2" />
      </div>
    )}
    <div className="space-y-3">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-5/6" />
      <SkeletonBase className="h-4 w-4/6" />
    </div>
    {showFooter && (
      <div className="flex justify-between items-center pt-4">
        <SkeletonBase className="h-8 w-20" />
        <SkeletonBase className="h-8 w-16" />
      </div>
    )}
  </div>
);

// Widget/Statistic skeleton
export const WidgetSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBase className="h-4 w-24" />
        <SkeletonBase className="h-8 w-16" />
      </div>
      <SkeletonBase className="h-12 w-12 rounded-full" />
    </div>
  </div>
);

// Chart skeleton
export const ChartSkeleton = ({ type = "bar" }) => {
  if (type === "pie") {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <SkeletonBase className="h-6 w-32 mb-4" />
        <div className="flex items-center justify-center">
          <SkeletonBase className="h-48 w-48 rounded-full" />
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <SkeletonBase className="h-6 w-32 mb-4" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-end space-x-1 h-32">
              {[...Array(12)].map((_, j) => (
                <SkeletonBase 
                  key={j} 
                  className={`w-4 bg-gray-200`}
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default bar chart
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SkeletonBase className="h-6 w-32 mb-4" />
      <div className="flex items-end space-x-2 h-48">
        {[...Array(8)].map((_, i) => (
          <SkeletonBase 
            key={i} 
            className="flex-1"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {/* Table header */}
    <div className="bg-gray-50 px-6 py-3 border-b">
      <div className="flex space-x-4">
        {[...Array(columns)].map((_, i) => (
          <SkeletonBase key={i} className="h-4 flex-1" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y divide-gray-200">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-6 py-4">
          <div className="flex space-x-4">
            {[...Array(columns)].map((_, j) => (
              <SkeletonBase key={j} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ items = 5, showAvatar = true }) => (
  <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="p-4 flex items-center space-x-4">
        {showAvatar && <SkeletonBase className="h-10 w-10 rounded-full" />}
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-4 w-3/4" />
          <SkeletonBase className="h-3 w-1/2" />
        </div>
        <SkeletonBase className="h-8 w-16" />
      </div>
    ))}
  </div>
);

// Program skeleton (based on your example)
export const ProgramSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="space-y-2">
      <SkeletonBase className="h-6 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
    <SkeletonBase className="h-32 w-full rounded" />
    <div className="space-y-2">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-4/5" />
    </div>
    <div className="flex justify-between items-center">
      <SkeletonBase className="h-8 w-20" />
      <SkeletonBase className="h-8 w-24" />
    </div>
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <SkeletonBase className="h-8 w-64" />
      <SkeletonBase className="h-4 w-96" />
    </div>
    
    {/* Stats grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <WidgetSkeleton key={i} />
      ))}
    </div>
    
    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton type="bar" />
      <ChartSkeleton type="pie" />
    </div>
    
    {/* Table */}
    <TableSkeleton />
  </div>
);

// Section skeleton (like your example)
export const SectionSkeleton = ({ title = true, items = 4, isMobile = false }) => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      {title && (
        <div className="text-center mb-12">
          <div className="animate-pulse">
            <SkeletonBase className="h-8 w-64 mx-auto mb-4" />
            <SkeletonBase className="w-20 h-1 mx-auto" />
          </div>
        </div>
      )}
      
      <div className={isMobile 
        ? "flex overflow-x-auto gap-6 pb-4 scrollbar-hide" 
        : "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }>
        {[...Array(items)].map((_, index) => (
          <div key={index} className={isMobile ? 'min-w-[280px] flex-shrink-0' : ''}>
            <ProgramSkeleton />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Export all skeletons as default
const SkeletonLoaders = {
  CardSkeleton,
  WidgetSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ListSkeleton,
  ProgramSkeleton,
  DashboardSkeleton,
  SectionSkeleton
};

export default SkeletonLoaders;