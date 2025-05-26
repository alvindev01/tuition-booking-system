import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import logo from '../../assets/MASA.png';
import studentImg from '../../assets/PROFILE OFFICIAL.jpg';

const navItems = [
  { label: 'Timetable', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at 50% 0%, #bbaaff 0%, #fff 70%)',
        pb: 8,
        m: 0,
        p: 0,
        overflowX: 'hidden',
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', pt: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', px: { xs: 1, md: 8 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="MASA Logo" style={{ height: 56, marginRight: 12 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>MASA</Typography>
              <Typography variant="caption" sx={{ color: '#555' }}>Modern Advanced System Association</Typography>
            </Box>
          </Box>
          {/* Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {navItems.map((item) => (
              <Button key={item.label} href={item.href} sx={{ color: '#222', fontWeight: 500, fontSize: 16, textTransform: 'none' }}>{item.label}</Button>
            ))}
          </Box>
          {/* Register Button */}
          <Button
            variant="outlined"
            href="/register"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 8,
              borderWidth: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: 16,
              background: '#fff',
              color: '#222',
              borderColor: '#bbaaff',
              boxShadow: '0 2px 8px rgba(187,170,255,0.1)',
              '&:hover': { background: '#f3f0ff', borderColor: '#a48fff' },
            }}
          >
            Register Now
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mt: 8, mb: 6, width: '100%' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', background: '#fff', px: 2.5, py: 1, borderRadius: 99, boxShadow: 1, mb: 2 }}>
          <SearchIcon sx={{ color: '#bbaaff', mr: 1 }} />
          <Typography sx={{ color: '#555', fontWeight: 500, fontSize: 16 }}>Your #1 Platform for Education</Typography>
        </Box>
        <Typography variant="h2" sx={{ fontWeight: 800, color: '#1a237e', mb: 1, fontSize: { xs: 36, md: 56 } }}>
          Online Tuition.
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 2, fontSize: { xs: 22, md: 36 } }}>
          Everything Everywhere All at Once
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#444', mb: 4 }}>
          Education is the most powerful weapon which you can use to change the world
        </Typography>
        {/* Help/WhatsApp Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderRadius: 99 }}>
            <SearchIcon sx={{ color: '#bbaaff', mr: 1 }} />
            <Typography sx={{ color: '#555', fontWeight: 500, fontSize: 16 }}>Need help? Reach out to our team.</Typography>
          </Paper>
          <Button
            variant="contained"
            startIcon={<WhatsAppIcon />}
            sx={{
              background: '#111',
              color: '#fff',
              borderRadius: 99,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': { background: '#25d366', color: '#111' },
            }}
            href="#"
          >
            Whatsapp
          </Button>
        </Box>
      </Box>

      {/* Student Images Row */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, px: 2, flexWrap: 'wrap', width: '100%' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              width: { xs: 120, sm: 160, md: 180 },
              height: { xs: 160, sm: 200, md: 220 },
              background: i % 2 === 0 ? '#fff9c4' : '#b2ebf2',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2,
            }}
          >
            <img
              src={studentImg}
              alt={`Student ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Home; 