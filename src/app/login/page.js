'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { useMultilingual } from '../../hooks/useMultilingual';
import { useRouter } from 'next/navigation';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Select, Space, Alert, Modal, Input, message } from 'antd';

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
  CircularProgress
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
  height: '600px',
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

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [contactIdentifier, setContactIdentifier] = useState('');
  const [higherRoleContact, setHigherRoleContact] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const theme = useTheme();
  const { login, user } = useAuth();
  const { t, getCurrentFont, changeLanguage, currentLanguage, supportedLanguages, languages } = useMultilingual();
  const router = useRouter();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleForgotPassword = async () => {
    if (!contactIdentifier) {
      message.error(t('login.enterEmailOrPhone'));
      return;
    }
    
    setForgotLoading(true);
    try {
      // Mock API call - in real implementation, this would call your backend
      // The API would return the higher role contact details
      // Simulating API response for demonstration
      setTimeout(() => {
        const mockResponse = {
          success: true,
          higherRole: {
            role: 'Murabi',
            name: 'Ahmed Khan',
            email: 'ahmed.khan@example.com',
            phone: '+92 300 1234567'
          }
        };
        
        setHigherRoleContact(mockResponse.higherRole);
        setForgotLoading(false);
      }, 1000);
      
    } catch (error) {
      message.error(t('login.errorContactingServer'));
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

          <Typography variant="h4" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
            {t('login.welcomeBack') || "Welcome back"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('login.emailAddress') || "Email"}
              name="email"
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('login.password') || "Password"}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
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
               <div className="p-4 rounded-3 border border-white border-opacity-25">
                 <Typography variant="body1" className="text-white fw-medium mb-4 text-end" style={{fontSize: '1.1rem', lineHeight: 1.6, direction: 'rtl'}}>
                   "ذکر اللہ سے دل کو سکون ملتا ہے۔ روزانہ کے معمولات سے روحانی ترقی کا سفر شروع ہوتا ہے۔"
                 </Typography>
                 <Typography variant="subtitle1" className="fw-bold text-white text-end" style={{direction: 'rtl'}}>
                   - شیخ محمد
                 </Typography>
                 <Typography variant="body2" className="text-white-50 text-end" style={{direction: 'rtl'}}>
                   مرشد سلسلہ نقشبندیہ
                 </Typography>
               </div>
               
               <div className="p-4 rounded-3 border border-white border-opacity-25">
                 <Typography variant="subtitle1" className="fw-bold text-white text-end" style={{direction: 'rtl'}}>
                   روحانی ترقی روزانہ کی عبادات کے ذریعے
                 </Typography>
                 <Typography variant="body2" className="text-white-50 text-end" style={{direction: 'rtl'}}>
                   اپنے روزانہ کے معمولات کو منظم کریں اور اپنی روحانی ترقی کا نقشہ دیکھیں۔
                 </Typography>
               </div>
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
               <div className="p-4 rounded-3 border border-white border-opacity-25">
                 <Typography variant="body1" className="text-white fw-medium mb-4" style={{fontSize: '1.1rem', lineHeight: 1.6}}>
                   "Remembrance of Allah brings peace to the heart. The journey of spiritual growth begins with daily practices."
                 </Typography>
                 <Typography variant="subtitle1" className="fw-bold text-white">
                   - Sheikh Muhammad
                 </Typography>
                 <Typography variant="body2" className="text-white-50">
                   Guide of Naqshbandi Order
                 </Typography>
               </div>
               
               <div className="p-4 rounded-3 border border-white border-opacity-25">
                 <Typography variant="subtitle1" className="fw-bold text-white mb-2">
                   Spiritual Growth Through Daily Practices
                 </Typography>
                 <Typography variant="body2" className="text-white-50">
                   Organize your daily routines and track your spiritual progress through consistent practice.
                 </Typography>
               </div>
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