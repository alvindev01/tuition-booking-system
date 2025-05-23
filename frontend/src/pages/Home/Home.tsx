import { Box, Container, Typography, Paper } from '@mui/material';
import {
  School as SchoolIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Expert Tutors',
      description: 'Learn from qualified and experienced tutors in various subjects.',
    },
    {
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Booking',
      description: 'Schedule your tuition sessions with just a few clicks.',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      title: 'Personalized Learning',
      description: 'Get customized learning plans tailored to your needs.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to Tuition Booking
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Your one-stop solution for quality education
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, 1fr)'
        },
        gap: 4
      }}>
        {features.map((feature, index) => (
          <Paper
            key={index}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Box sx={{ color: 'primary.main', mb: 2 }}>
              {feature.icon}
            </Box>
            <Typography variant="h5" component="h3" gutterBottom>
              {feature.title}
            </Typography>
            <Typography color="text.secondary" align="center">
              {feature.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Home; 