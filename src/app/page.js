'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@/components/Loaders';
import { Box, Button, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%)',
  padding: '80px 0',
  color: 'white',
  textAlign: 'center',
  borderRadius: '0 0 20px 20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '12px 30px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '1rem',
  margin: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
}));

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  // Simulate page loading
  setTimeout(() => {
    setPageLoading(false);
  }, 1500);

  if (loading || pageLoading) {
    return <FullPageLoader variant="branded" message="Loading application..." />;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    router.push(`/dashboard/${user.role}`);
    return <FullPageLoader variant="branded" message="Redirecting to dashboard..." />;
  }

  const handleLoginClick = () => {
    router.push('/login');
  };

  const features = [
    {
      title: 'Track Daily Practices',
      description: 'Record and monitor your daily spiritual activities with ease.',
      icon: <TrackChangesIcon sx={{ fontSize: 60, color: '#9333ea' }} />,
    },
    {
      title: 'Progress Visualization',
      description: 'View your spiritual journey progress through intuitive charts and statistics.',
      icon: <TimelineIcon sx={{ fontSize: 60, color: '#ec4899' }} />,
    },
    {
      title: 'Community Connection',
      description: 'Connect with mentors and fellow practitioners for guidance and motivation.',
      icon: <GroupIcon sx={{ fontSize: 60, color: '#f97316' }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Tasbiaat & Mamolaat
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Islamic Spiritual Tracking Platform
          </Typography>
          <Typography variant="body1" sx={{ mb: 6, fontSize: '1.1rem', maxWidth: '700px', mx: 'auto' }}>
            Track your daily spiritual practices, monitor your progress, and enhance your spiritual journey with our comprehensive platform.
          </Typography>
          <Box>
            <ActionButton 
              variant="contained" 
              color="secondary" 
              size="large" 
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
            >
              Sign In
            </ActionButton>
            <ActionButton 
              variant="outlined" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'white' }} 
              size="large" 
              startIcon={<DashboardIcon />}
              onClick={handleLoginClick}
            >
              Get Started
            </ActionButton>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard elevation={3}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Ready to Begin Your Spiritual Journey?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Join our platform today and take your spiritual practices to the next level.
          </Typography>
          <ActionButton 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<LoginIcon />}
            onClick={handleLoginClick}
          >
            Sign In Now
          </ActionButton>
        </Container>
      </Box>
    </Box>
  );
}
