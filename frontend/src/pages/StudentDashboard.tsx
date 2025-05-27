import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  EventAvailable as EventAvailableIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

interface Session {
  id: number;
  subject: string;
  details: string;
  datetime: string;
  duration: number;
  maxStudents: number;
  currentBookings: number;
}

const StudentDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      setSnackbar({open: true, message: 'Failed to fetch sessions', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (sessionId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Successfully booked the session!',
          severity: 'success'
        });
        // Refresh sessions to update the booking count
        fetchSessions();
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'Failed to book session. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Network error. Please check your connection and try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', background: 'radial-gradient(circle at 50% 0%, #bbaaff 0%, #fff 70%)', p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mt: 4, mb: 6 }}>
        <EventAvailableIcon sx={{ fontSize: 64, color: '#1976d2', mb: 1 }} />
        <Typography variant="h3" fontWeight={800} color="primary" sx={{ mb: 1 }}>
          Welcome, Student!
        </Typography>
        <Typography variant="h5" fontWeight={600} color="#333" sx={{ mb: 1 }}>
          Browse and Book Your Next Learning Session
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Find a session that matches your interests and schedule. Book your spot before it's full!
        </Typography>
      </Box>
      {/* Session Cards or Empty State */}
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" color="text.secondary">
            Loading sessions...
          </Typography>
        </Box>
      ) : sessions.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <EmojiEventsIcon sx={{ fontSize: 80, color: '#bbaaff', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No sessions available at the moment.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please check back later or contact your teacher for more information.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {sessions.map((session) => (
            <Card
              key={session.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div" fontWeight={600}>
                    {session.subject}
                  </Typography>
                  <Chip
                    label={dayjs(session.datetime).isAfter(dayjs()) ? 'Upcoming' : 'Past'}
                    color={dayjs(session.datetime).isAfter(dayjs()) ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {session.details}
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {dayjs(session.datetime).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Duration: {session.duration} minutes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Bookings: {session.currentBookings}/{session.maxStudents}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  disabled={loading || session.currentBookings >= session.maxStudents || !dayjs(session.datetime).isAfter(dayjs())}
                  onClick={() => handleBook(session.id)}
                >
                  Book
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentDashboard; 