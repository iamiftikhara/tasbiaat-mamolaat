'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Token storage keys
  const ACCESS_TOKEN_KEY = 'authToken';
  const REFRESH_TOKEN_KEY = 'refreshToken';
  const USER_DATA_KEY = 'userData';

  // API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Encryption key from environment variables
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  // Token storage utilities
  const storeTokens = (accessToken, refreshToken, userData) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  };

  const getStoredTokens = () => {
    return {
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      userData: JSON.parse(localStorage.getItem(USER_DATA_KEY) || 'null')
    };
  };

  const clearStoredTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  };

  // Generate system key for API calls
  const generateSystemKey = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${randomString}`;
  };

  // Encrypt system key (simplified - in production use proper encryption)
  const encryptSystemKey = (systemKey) => {
    // This is a placeholder - implement proper encryption with backend public key
    return btoa(systemKey);
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    if (isRefreshing) return null;
    
    setIsRefreshing(true);
    
    try {
      const storedTokens = getStoredTokens();
      if (!storedTokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:5000/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: storedTokens.refreshToken }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          setAuthToken(data.access_token);
          setRefreshToken(data.refresh_token || storedTokens.refreshToken);
          
          // Update stored tokens
          storeTokens(data.access_token, data.refresh_token || storedTokens.refreshToken, storedTokens.userData);
          
          return data.access_token;
        }
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      logout();
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          
          // Handle new response format
          const token = data.token;
          const userData = data.user;
          const sessionData = data.session;
          
          // Set state
          setAuthToken(token);
          setUser(userData);
          
          // Store tokens and user data securely
          storeTokens(token, null, userData);
          
          console.log('Login successful:', userData);
          
          // Redirect based on role
          const roleRoutes = {
            Saalik: '/dashboard/saalik',
            Murabi: '/dashboard/murabi',
            Masool: '/dashboard/masool',
            Sheikh: '/dashboard/sheikh',
            Admin: '/dashboard/admin',
            User: '/dashboard/user',
            Guest: '/dashboard/guest'
          };
          
          router.push(roleRoutes[userData.role] || '/dashboard');
          return { success: true };
        } else {
          return { success: false, error: result.message };
        }
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
    clearStoredTokens();
    router.push('/login');
  };

  // API call wrapper with authentication and automatic token refresh
  const apiCall = async (endpoint, data = {}, method = 'GET', retryCount = 0) => {
    let currentToken = authToken;
    
    if (!currentToken) {
      throw new Error('No authentication token');
    }

    const baseUrl = 'http://localhost:5000';
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    // Generate and encrypt system key for enhanced security
    const systemKey = generateSystemKey();
    const encryptedKey = encryptSystemKey(systemKey);

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        'X-System-Key': encryptedKey
      },
    };

    if (method !== 'GET' && Object.keys(data).length > 0) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, requestOptions);

      // If token is expired (401) and we haven't retried yet, try to refresh
      if (response.status === 401 && retryCount === 0) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the request with new token
          return apiCall(endpoint, data, method, 1);
        } else {
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (retryCount === 0 && error.message.includes('fetch')) {
        // Network error, try refreshing token once
        const newToken = await refreshAccessToken();
        if (newToken) {
          return apiCall(endpoint, data, method, 1);
        }
      }
      throw error;
    }
  };

  // Check for existing tokens on mount and verify authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = getStoredTokens();
        
        if (storedTokens.accessToken && storedTokens.userData) {
          // Set initial state from localStorage
          setAuthToken(storedTokens.accessToken);
          setRefreshToken(storedTokens.refreshToken);
          setUser(storedTokens.userData);

          // Verify token with backend
          try {
            const response = await fetch('http://localhost:5000/v1/auth/verify', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedTokens.accessToken}`,
              },
            });

            const result = await response.json();
            
            if (result.success && result.data) {
              // Token is valid, update user data if needed
              setUser(result.data.user);
              storeTokens(storedTokens.accessToken, storedTokens.refreshToken, result.data.user);
            } else if (response.status === 401 && storedTokens.refreshToken) {
              // Access token expired, try to refresh
              const newToken = await refreshAccessToken();
              if (!newToken) {
                // Refresh failed, clear everything
                clearStoredTokens();
                setAuthToken(null);
                setRefreshToken(null);
                setUser(null);
              }
            } else {
              // Token invalid, clear everything
              clearStoredTokens();
              setAuthToken(null);
              setRefreshToken(null);
              setUser(null);
            }
          } catch (error) {
            console.error('Token verification error:', error);
            // Try to refresh token on network error
            if (storedTokens.refreshToken) {
              const newToken = await refreshAccessToken();
              if (!newToken) {
                clearStoredTokens();
                setAuthToken(null);
                setRefreshToken(null);
                setUser(null);
              }
            } else {
              clearStoredTokens();
              setAuthToken(null);
              setRefreshToken(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearStoredTokens();
        setAuthToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    authToken,
    refreshToken,
    loading,
    isRefreshing,
    login,
    logout,
    apiCall,
    refreshAccessToken,
    generateSystemKey,
    encryptSystemKey
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };