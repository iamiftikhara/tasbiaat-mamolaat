'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  // Set loading state for a specific component/operation
  const setLoading = useCallback((key, isLoading, message = '') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading ? { loading: true, message } : undefined
    }));
  }, []);

  // Get loading state for a specific component/operation
  const getLoading = useCallback((key) => {
    return loadingStates[key] || { loading: false, message: '' };
  }, [loadingStates]);

  // Check if any component is loading
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state?.loading) || globalLoading;
  }, [loadingStates, globalLoading]);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
  }, []);

  // Set global loading (for full page loading)
  const setGlobalLoadingState = useCallback((isLoading, message = '') => {
    setGlobalLoading(isLoading);
  }, []);

  const value = {
    loadingStates,
    globalLoading,
    setLoading,
    getLoading,
    isAnyLoading,
    clearAllLoading,
    setGlobalLoadingState
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use loading context
export const useLoading = (key = null) => {
  const context = useContext(LoadingContext);
  
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  const { setLoading, getLoading, setGlobalLoadingState, globalLoading } = context;

  // If no key provided, return global loading functions
  if (!key) {
    return {
      ...context,
      setGlobalLoading: setGlobalLoadingState,
      globalLoading
    };
  }

  // Return functions specific to the provided key
  const loading = getLoading(key);
  
  return {
    loading: loading.loading,
    message: loading.message,
    setLoading: (isLoading, message) => setLoading(key, isLoading, message),
    ...context
  };
};

// Hook for API calls with automatic loading management
export const useApiLoading = (key) => {
  const { setLoading, getLoading } = useLoading();
  
  const executeWithLoading = useCallback(async (apiCall, loadingMessage = 'جاري تحميل البيانات...') => {
    try {
      setLoading(key, true, loadingMessage);
      const result = await apiCall();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [key, setLoading]);

  const loading = getLoading(key);

  return {
    loading: loading.loading,
    message: loading.message,
    executeWithLoading
  };
};

export default LoadingContext;