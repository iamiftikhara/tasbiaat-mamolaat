'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { useMultilingual } from '../../hooks/useMultilingual';
import { useRouter } from 'next/navigation';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { Select, Space, Modal, Input } from 'antd';
import Script from 'next/script';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Encryption key from environment variables
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

// Material UI imports
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  InputAdornment, 
  IconButton, 
  Checkbox, 
  FormControlLabel,
  CircularProgress,
  Select as MuiSelect,
  MenuItem,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

// React Bootstrap imports
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Social login icons
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#333',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  margin: '0 8px',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const GradientBackground = styled(Box)({
  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  '@media (max-width: 768px)': {
    padding: '0',
  },
});

const LoginCard = styled(Box)({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  backgroundColor: 'white',
  display: 'flex',
  maxWidth: '1000px',
  width: '100%',
  height: '650px',
  '@media (max-width: 768px)': {
    height: '100vh',
    borderRadius: '0',
    maxWidth: '100%',
  },
});

const FormSection = styled(Box)({
  padding: '2.5rem',
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '@media (max-width: 768px)': {
    width: '100%',
  },
});

const TestimonialSection = styled(Box)({
  width: '50%',
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  color: 'white',
  padding: '2.5rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '@media (max-width: 768px)': {
    display: 'none',
  },
});

const StarPattern = styled(Box)({
  position: 'absolute',
  bottom: '20%',
  right: '10%',
  width: '200px',
  height: '200px',
  opacity: 0.6,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 0L120 80H200L135 130L155 200L100 155L45 200L65 130L0 80H80L100 0Z' fill='%234f46e5'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
});

const MoonPattern = styled(Box)({
  position: 'absolute',
  top: '15%',
  left: '10%',
  width: '100px',
  height: '100px',
  opacity: 0.4,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50c27.6 0 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40c22.1 0 40 17.9 40 40s-17.9 40-40 40z' fill='%23f9a8d4'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
});

const IslamicPatternBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.15,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10L70 30H90L75 45L85 65H65L60 85L55 65H35L45 45L30 30H50L60 10Z' fill='%23f9a8d4'/%3E%3Cpath d='M30 30L35 40H45L38 48L42 58H32L30 68L28 58H18L22 48L15 40H25L30 30Z' fill='%238b5cf6'/%3E%3Cpath d='M90 30L95 40H105L98 48L102 58H92L90 68L88 58H78L82 48L75 40H85L90 30Z' fill='%238b5cf6'/%3E%3Cpath d='M60 70L65 80H75L68 88L72 98H62L60 108L58 98H48L52 88L45 80H55L60 70Z' fill='%238b5cf6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '120px 120px',
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.4) 0%, rgba(139, 92, 246, 0.3) 100%)',
    zIndex: -1,
  }
});

const TestimonialCard = styled(Box)({
  backgroundColor: 'rgba(79, 70, 229, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  marginTop: '2rem',
  zIndex: 1,
});

const AvatarGroup = styled(Box)({
  display: 'flex',
  marginTop: '1.5rem',
  '& .avatar': {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid white',
    marginLeft: '-8px',
    backgroundColor: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
});

// Configuration for showing/hiding demo accounts section
const appConfig = {
  showDemoAccounts: process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS === 'true' // Use environment variable
};

// Demo accounts data structure
const demoAccountsData = [
  {
    email: "admin@tasbiaat.com",
    password: "admin123",
    role: "Admin"
  },
  {
    email: "user@tasbiaat.com",
    password: "user123",
    role: "User"
  },
  {
    email: "guest@tasbiaat.com",
    password: "guest123",
    role: "Guest"
  }
];

// Slider card data structure
const sliderCardsData = [
  {
    en: {
      quote: "اَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      translation: "Verily, in the remembrance of Allah do hearts find rest.",
      source: "Surah Ar-Ra'd, Verse 28"
    },
    ur: {
      quote: "اَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      translation: "سن لو! اللہ کے ذکر سے دلوں کو سکون ملتا ہے۔",
      source: "سورۃ الرعد، آیت ٢٨"
    }
  },
  {
    en: {
      quote: "Remembrance of Allah brings peace to the heart, purifies the soul, and enhances one's intellectual and spiritual capabilities.",
      source: "Mufti Syed Mukhtar uddin Shah Sahib",
      subtitle: "Guide of Chishtiya Order"
    },
    ur: {
      quote: "ذکر اللہ سے دل کو سکون ملتا ہے، روح پاک ہوتی ہے، اور انسان کی فکری و روحانی صلاحیتیں بڑھتی ہیں۔",
      source: "مفتی سید مختار الدین شاہ",
      subtitle: "مرشد سلسلہ چشتیہ"
    }
  },
  {
    en: {
      title: "Spiritual Growth Through Daily Practices",
      description: "Organize your daily routines and track your spiritual progress through consistent practice."
    },
    ur: {
      title: "روحانی ترقی روزانہ کی عبادات کے ذریعے",
      description: "اپنے روزانہ کے معمولات کو منظم کریں اور اپنی روحانی ترقی کا نقشہ دیکھیں۔"
    }
  }
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [contactIdentifier, setContactIdentifier] = useState('');
  const [higherRoleContact, setHigherRoleContact] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginInputType, setLoginInputType] = useState('email'); // 'email' or 'phone'
  const [countryCode, setCountryCode] = useState('+92'); // Default country code
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const theme = useTheme();
  const { login, user } = useAuth();
  const { t, getCurrentFont, changeLanguage, currentLanguage, supportedLanguages, languages } = useMultilingual();
  const router = useRouter();
  
  // Add useEffect to check for existing session and redirect
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
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
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    };
    
    checkSession();
  }, [router]);
  
  // No need for toast configuration in useEffect as ToastContainer handles this
  useEffect(() => {
    // React-Toastify configuration is now handled by the ToastContainer component
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const roleRoutes = {
        Saalik: '/dashboard/saalik',
        Murabi: '/dashboard/murabi',
        Masool: '/dashboard/masool',
        Sheikh: '/dashboard/sheikh',
        Admin: '/dashboard/admin'
      };
      router.push(roleRoutes[user.role] || '/dashboard');
    }
  }, [user, router]);

  // Toggle between email and phone input
  const toggleLoginInputType = () => {
    setLoginInputType(prev => prev === 'email' ? 'phone' : 'email');
  };

  // Validate email
  const validateEmail = (email) => {
    // Only validate if there's at least one character
    if (!email || email.trim() === '') {
      setEmailError('');
      return true;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };

  // Validate phone number
  const validatePhone = (phone) => {
    // Only validate if there's at least one character
    if (!phone || phone.trim() === '') {
      setPhoneError('');
      return true;
    }
    
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // For Pakistani numbers, accept with or without leading zero
    let isValid = false;
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      // Valid format with leading zero (03xxxxxxxxx) - 11 digits
      isValid = true;
    } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('0')) {
      // Valid format without leading zero (3xxxxxxxxx) - 10 digits
      isValid = true;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('92')) {
      // Valid format with country code (923xxxxxxxxx) - 12 digits
      isValid = true;
    }
    
    setPhoneError(isValid ? '' : 'Please enter a valid Pakistani phone number (e.g., 03xxxxxxxxx or 3xxxxxxxxx)');
    return isValid;
  };
  
  // Format Pakistani phone number
  const formatPakistaniPhone = (phone) => {
    // Remove any non-digit characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Handle Pakistani numbers
    if (cleanPhone.startsWith('0')) {
      // If starts with 0, replace with +92
      return '+92' + cleanPhone.substring(1);
    } else {
      // If no leading zero, add +92
      return '+92' + cleanPhone;
    }
  };
  
  // Encrypt password before sending to API
  const encryptPassword = (password) => {
    try {
      return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return password; // Fallback to unencrypted password if encryption fails
    }
  };
  
  // Validate password
  const validatePassword = (password) => {
    // Only validate if there's at least one character
    if (!password || password === '') {
      setPasswordError('');
      return true;
    }
    
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : 'Password must be at least 6 characters');
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    const formData = new FormData(event.currentTarget);
    let identifier;
    const password = formData.get('password');
    
    // Get and validate the identifier (email or phone)
    if (loginInputType === 'email') {
      identifier = formData.get('email');
      if (!validateEmail(identifier)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.',
          confirmButtonText: 'OK',
          confirmButtonColor: theme.getColor('primary', 500),
          timer: 3000,
          timerProgressBar: true
        });
        return;
      }
    } else {
      const phoneNumber = formData.get('phone');
      // Format Pakistani phone number
      identifier = formatPakistaniPhone(phoneNumber);
      if (!validatePhone(phoneNumber)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Phone Number',
          text: 'Please enter a valid phone number.',
          confirmButtonText: 'OK',
          confirmButtonColor: theme.getColor('primary', 500),
          timer: 3000,
          timerProgressBar: true
        });
        return;
      }
    }
    
    // Validate all fields before submission
      let isValid = true;
      if (loginInputType === 'email') {
        isValid = validateEmail(identifier) && isValid;
      } else {
        isValid = validatePhone(identifier) && isValid;
      }
      isValid = validatePassword(password) && isValid;
     
     if (!isValid) {
       return; // Don't proceed if validation fails
     }
    
    setLoading(true);
    
    try {
      // Show loading message
      toast.info('Logging in, please wait...', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      // Encrypt password before sending to API
      const encryptedPassword = encryptPassword(password);
      
      // Use the login function from AuthContext directly
      // This function handles API call, token storage, and redirection
      const result = await login(identifier, encryptedPassword);
      
      if (result && result.success) {
        // Show success message with SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        // Redirection is handled by the login function in AuthContext
      } else {
        // Show error message with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: (result && result.message) || 'Please try again.',
          timer: 3000,
          timerProgressBar: true,
          confirmButtonText: 'OK',
          confirmButtonColor: theme.getColor('primary', 500)
        });
      }
    } catch (err) {
      // Show network error with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: theme.getColor('primary', 500),
        timer: 3000,
        timerProgressBar: true
      });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleForgotPassword = async () => {
    if (!contactIdentifier) {
      // Show notification for missing email/phone
      toast.error(t('login.enterEmailOrPhone'), {
        icon: () => <MailOutlined style={{ color: '#fff' }} />
      });
      return;
    }
    
    setForgotLoading(true);
    try {
      // Call the forgot password API endpoint
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_or_email: contactIdentifier
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Set the higher role contact information from the API response
        setHigherRoleContact({
          role: data.data.contact.role,
          name: data.data.contact.name,
          email: data.data.contact.contact.email,
          phone: data.data.contact.contact.phone
        });
        
        // Show success notification
         toast.success(t('login.contactInfoRetrieved'), {
           icon: () => <PhoneOutlined style={{ color: '#fff' }} />
         });
      } else {
        // Show error with SweetAlert
        Swal.fire({
          icon: 'error',
          title: t('login.errorOccurred'),
          text: data.message || t('login.errorContactingServer'),
          confirmButtonText: t('common.ok'),
          confirmButtonColor: theme.getColor('primary', 500)
        });
      }
    } catch (error) {
      // Show error with SweetAlert
      Swal.fire({
        icon: 'error',
        title: t('login.errorOccurred'),
        text: t('login.errorContactingServer'),
        confirmButtonText: t('common.ok'),
        confirmButtonColor: theme.getColor('primary', 500)
      });
      console.error('Forgot password error:', error);
    } finally {
      setForgotLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setForgotModalVisible(false);
    setContactIdentifier('');
    setHigherRoleContact(null);
  };

  return (
    <GradientBackground>
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <LoginCard>
          {/* Form Section */}
          <FormSection>
            {/* Language Switcher - Moved before the title */}
            <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
              <Select
                value={currentLanguage}
                onChange={changeLanguage}
                style={{
                  width: '120px',
                  borderRadius: theme.getRadius('xl')
                }}
                size="large"
                suffixIcon={<GlobalOutlined style={{ color: theme.getColor('primary', 500) }} />}
                classNames={{ popup: { root: 'language-dropdown' } }}
              >
                {supportedLanguages.map((lang) => (
                  <Select.Option key={lang} value={lang}>
                    <Space>
                      <span>{languages[lang]?.flag}</span>
                      <span style={{ fontFamily: getCurrentFont('primary') }}>
                        {languages[lang]?.name}
                      </span>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: theme.getGradient('primary'),
                  mr: 2
                }}
              >
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  style={{ width: 24, height: 24 }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {t('app.title')}
              </Typography>
            </Box>

            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
              {t('login.welcomeBack') || "Welcome back"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {t('login.enterDetails') || "Please enter your account details"}
            </Typography>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className="mb-4 rounded-xl"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              />
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {"Login with"}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    size="small" 
                    onClick={toggleLoginInputType}
                    type="button"
                    startIcon={loginInputType === 'email' ? <PhoneOutlined /> : <EmailIcon />}
                    sx={{ borderRadius: '4px', textTransform: 'none' }}
                  >
                    {loginInputType === 'email' ? 'Use Phone Number' : 'Use Email'}
                  </Button>
              </Box>
              
              {loginInputType === 'email' ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('login.emailAddress') || "Email"}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={!!emailError}
                  helperText={emailError}
                  onChange={(e) => validateEmail(e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <MuiSelect
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      sx={{ width: '30%' }}
                      size="small"
                      error={!!phoneError}
                    >
                      <MenuItem value="+92">+92 (Pak)</MenuItem>
                      <MenuItem value="+1">+1 (USA/Canada)</MenuItem>
                      <MenuItem value="+44">+44 (UK)</MenuItem>
                      <MenuItem value="+91">+91 (India)</MenuItem>
                      <MenuItem value="+971">+971 (UAE)</MenuItem>
                      <MenuItem value="+966">+966 (KSA)</MenuItem>
                    </MuiSelect>
                    <TextField
                      required
                      fullWidth
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      error={!!phoneError}
                      onChange={(e) => validatePhone(e.target.value)}
                      onBlur={(e) => validatePhone(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {phoneError && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {phoneError}
                    </Typography>
                  )}
                </Box>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('login.password') || "Password"}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                error={!!passwordError}
                helperText={passwordError}
                onChange={(e) => validatePassword(e.target.value)}
                onBlur={(e) => validatePassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="remember" 
                      color="primary" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label={t('login.keepMeLoggedIn') || "Keep me logged in"}
                />
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setForgotModalVisible(true)}
                >
                  {t('login.forgotPassword') || 'Forgot Password?'}
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  py: 1.5, 
                  background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #d946ef, #8b5cf6)',
                  }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t('login.signIn') || 'Sign in'}
              </Button>
              
            </Box>
          </FormSection>

          {/* Spiritual Guidance Section */}
          <TestimonialSection className="position-relative overflow-hidden" 
                              style={{
                                backgroundColor: "#00000091",
                                minHeight: "600px"
                              }}>
            
            {/* Urdu Section */}
            <div className="position-absolute top-0 start-0 w-100 h-100 p-4 p-md-5 d-flex flex-column justify-content-between"
                  style={{
                    opacity: 1,
                    animation: 'slideSection1 10s infinite',
                    zIndex: 2
                  }}>
              {/* Title - Urdu */}
                <div className="text-end mb-2">
                  <Typography variant="h2" className="fw-semibold text-white" style={{fontFamily: "serif", direction: "rtl", fontSize: "2.5rem"}}>
                    رُوحَانِی سَفَر
                  </Typography>
                  <Typography variant="h5" className="fw-medium text-white-50 text-end" style={{direction: "rtl"}}>
                    روزانہ کی عبادات کے ذریعے روحانی ترقی
                  </Typography>
                </div>
              
              {/* Content - Urdu */}
              <div className="d-flex flex-column gap-4">
                {sliderCardsData.map((card, index) => (
                  <div key={`urdu-card-${index}`} className="p-2 rounded-3 border border-white border-opacity-25">
                    {card.ur.quote && (
                      <Typography variant="body1" className="text-white fw-medium mb-2 text-end" style={{fontSize: '1.1rem', lineHeight: 1.6, direction: 'rtl'}}>
                        {card.ur.quote.startsWith('ا') ? `"${card.ur.quote}"` : card.ur.quote}
                      </Typography>
                    )}
                    {card.ur.translation && (
                      <Typography variant="body1" className="text-white fw-medium mb-4 text-end" style={{fontSize: '1rem', lineHeight: 1.6, direction: 'rtl'}}>
                        {`"${card.ur.translation}"`}
                      </Typography>
                    )}
                    {card.ur.source && (
                      <Typography variant="subtitle1" className="fw-bold text-white text-end" style={{direction: 'rtl'}}>
                        - {card.ur.source}
                      </Typography>
                    )}
                    {card.ur.subtitle && (
                      <Typography variant="body2" className="text-white-50 text-end" style={{direction: 'rtl'}}>
                        {card.ur.subtitle}
                      </Typography>
                    )}
                    {card.ur.title && (
                      <Typography variant="subtitle1" className="fw-bold text-white text-end" style={{direction: 'rtl'}}>
                        {card.ur.title}
                      </Typography>
                    )}
                    {card.ur.description && (
                      <Typography variant="body2" className="text-white-50 text-end" style={{direction: 'rtl'}}>
                        {card.ur.description}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* English Section */}
            <div className="position-absolute top-0 start-0 w-100 h-100 p-4 p-md-5 d-flex flex-column justify-content-between"
                  style={{
                    opacity: 0,
                    animation: 'slideSection2 10s infinite',
                    zIndex: 1
                  }}>
              {/* Title - English */}
                <div className="mb-2" dir='ltr'>
                  <Typography variant="h2" className="fw-semibold text-white" style={{fontFamily: "serif", fontSize: "2.5rem"}}>
                    Spiritual Journey
                  </Typography>
                  <Typography variant="h5" className="fw-medium text-white-50" style={{fontSize: '1.3rem'}}>
                    Spiritual Growth Through Daily Practices
                  </Typography>
                </div>
              
              {/* Content - English */}
              <div className="d-flex flex-column gap-4" dir='ltr'>
                {sliderCardsData.map((card, index) => (
                  <div key={`english-card-${index}`} className="p-2 rounded-3 border border-white border-opacity-25">
                    {card.en.quote && (
                      <Typography variant="body1" className="text-white fw-medium mb-2" style={{fontSize: '1rem', lineHeight: 1.6}}>
                        {card.en.quote.startsWith('ا') ? `"${card.en.quote}"` : card.en.quote}
                      </Typography>
                    )}
                    {card.en.translation && (
                      <Typography variant="body1" className="text-white fw-medium mb-4" style={{fontSize: '1rem', lineHeight: 1.6}}>
                        {`"${card.en.translation}"`}
                      </Typography>
                    )}
                    {card.en.source && (
                      <Typography variant="subtitle1" className="fw-bold text-white">
                        - {card.en.source}
                      </Typography>
                    )}
                    {card.en.subtitle && (
                      <Typography variant="body2" className="text-white-50">
                        {card.en.subtitle}
                      </Typography>
                    )}
                    {card.en.title && (
                      <Typography variant="subtitle1" className="fw-bold text-white mb-2">
                        {card.en.title}
                      </Typography>
                    )}
                    {card.en.description && (
                      <Typography variant="body2" className="text-white-50">
                        {card.en.description}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Slider indicators */}
            <div className="position-absolute start-50 translate-middle-x d-flex gap-2" 
                  style={{
                    bottom: "20px",
                    zIndex: 10
                  }}>
              <div className="rounded-circle" 
                    style={{
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: 'white',
                      opacity: 0.7,
                      animation: 'pulse1 10s infinite'
                    }}></div>
              <div className="rounded-circle" 
                    style={{
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: 'white',
                      opacity: 0.7,
                      animation: 'pulse2 10s infinite'
                    }}></div>
            </div>
            
            <style jsx>{`
              @keyframes slideSection1 {
                0%, 45%, 100% { opacity: 1; transform: translateX(0); }
                50%, 95% { opacity: 0; transform: translateX(-100%); }
              }
              @keyframes slideSection2 {
                0%, 45%, 100% { opacity: 0; transform: translateX(100%); }
                50%, 95% { opacity: 1; transform: translateX(0); }
              }
              @keyframes pulse1 {
                0%, 45%, 100% { opacity: 1; }
                50%, 95% { opacity: 0.4; }
              }
              @keyframes pulse2 {
                0%, 45%, 100% { opacity: 0.4; }
                50%, 95% { opacity: 1; }
              }
            `}</style>
          </TestimonialSection>
          </LoginCard>

        {/* Demo Accounts Section - Conditionally rendered based on appConfig */}
        {appConfig.showDemoAccounts && (
          <Box 
            sx={{ 
              mt: 3, 
              mb: 4, 
              mx: 'auto', 
              maxWidth: 400, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'background.paper',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              direction: currentLanguage === 'en' ? 'ltr' : 'rtl'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'medium' }}>
              {t('login.demoAccounts') || "Demo Accounts"}
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {demoAccountsData.map((account, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', p: 1, bgcolor: 'action.hover', borderRadius: 1, mb: 1 }}>
                  {account.role && (
                    <Typography variant="caption" sx={{ alignSelf: 'flex-start', mb: 0.5, fontWeight: 'bold', color: 'primary.main' }}>
                      {account.role}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: currentLanguage === 'en' ? 1 : 0, ml: currentLanguage === 'en' ? 0 : 1, fontSize: 18, color: 'primary.main' }} />
                      {t('login.email') || "Email"}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'background.default', px: 1, py: 0.5, borderRadius: 1 }}>
                      {account.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                      <LockIcon sx={{ mr: currentLanguage === 'en' ? 1 : 0, ml: currentLanguage === 'en' ? 0 : 1, fontSize: 18, color: 'primary.main' }} />
                      {t('login.password') || "Password"}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'background.default', px: 1, py: 0.5, borderRadius: 1 }}>
                      {account.password}
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                    startIcon={currentLanguage === 'en' ? <LoginIcon /> : null}
                    endIcon={currentLanguage !== 'en' ? <LoginIcon /> : null}
                    onClick={() => {
                      // Auto-fill the form with demo credentials
                      document.querySelector('input[name="email"]').value = account.email;
                      document.querySelector('input[name="password"]').value = account.password;
                    }}
                  >
                    {t('login.useDemoAccount') || "Use This Account"}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
       {/* Forgot Password Modal */}
       <Modal
         title={t('login.forgotPassword') || "Forgot Password"}
         open={forgotModalVisible}
         onCancel={handleCloseModal}
         footer={null}
         centered
       >
         {!higherRoleContact ? (
           <div>
             <p style={{ marginBottom: '16px' }}>{t('login.enterEmailOrPhonePrompt') || "Enter your email or phone number to find your account"}</p>
             <Input
               placeholder={t('login.emailOrPhone') || "Email or Phone Number"}
               value={contactIdentifier}
               onChange={(e) => setContactIdentifier(e.target.value)}
               prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
               style={{ marginBottom: '16px' }}
             />
             <Button 
               type="primary" 
               onClick={handleForgotPassword} 
               loading={forgotLoading}
               block
             >
               {t('login.submit') || "Submit"}
             </Button>
           </div>
         ) : (
           <div>
             <Alert
               message={t('login.contactHigherRole') || "Contact your supervisor"}
               description={t('login.passwordResetMessage') || "Password reset is managed by your supervisor. Please contact them using the details below:"}
               type="info"
               showIcon
               style={{ marginBottom: '16px' }}
             />
             <div className="contact-details" style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '16px' }}>
               <p><strong>{t('login.supervisorName') || "Name"}:</strong> {higherRoleContact.name}</p>
               <p><strong>{t('login.supervisorRole') || "Role"}:</strong> {higherRoleContact.role}</p>
               <p><strong>{t('login.supervisorEmail') || "Email"}:</strong> {higherRoleContact.email}</p>
               <p><strong>{t('login.supervisorPhone') || "Phone"}:</strong> {higherRoleContact.phone}</p>
             </div>
             
             <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
               <h4 style={{ margin: '0 0 8px 0' }}>{higherRoleContact.name} ({higherRoleContact.role})</h4>
               
               {higherRoleContact.email && (
                 <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
                   <MailOutlined style={{ marginRight: '8px' }} /> {higherRoleContact.email}
                 </p>
               )}
               
               {higherRoleContact.phone && (
                 <p style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
                   <PhoneOutlined style={{ marginRight: '8px' }} /> {higherRoleContact.phone}
                 </p>
               )}
             </div>
             
             <Button type="primary" onClick={handleCloseModal} block>
               {t('login.close') || "Close"}
             </Button>
           </div>
         )}
       </Modal>
     </GradientBackground>
  );
}