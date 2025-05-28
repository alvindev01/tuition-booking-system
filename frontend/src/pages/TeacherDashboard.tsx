import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

interface Booking {
  id: number;
  studentId: number;
  studentName: string;
  bookingDate: string;
}

interface Session {
  id: number;
  subject: string;
  details: string;
  datetime: string;
  duration: number;
  maxStudents: number;
  currentBookings: number;
  bookings?: Booking[];
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [viewBookingsDialog, setViewBookingsDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [datetime, setDatetime] = useState<Dayjs | null>(dayjs());
  const [duration, setDuration] = useState(60);
  const [maxStudents, setMaxStudents] = useState(10);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/teacher/1`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to fetch sessions:', error);
        return;
      }
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchSessionBookings = async (sessionId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${sessionId}/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const bookings = await response.json();
      
      // Update the session with the new bookings
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              bookings,
              currentBookings: bookings.length // Update current bookings count
            } 
          : session
      ));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // You might want to show an error message to the user here
    }
  };

  // Add a function to refresh all sessions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSessions();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewBookings = (session: Session) => {
    setSelectedSession(session);
    if (!session.bookings) {
      fetchSessionBookings(session.id);
    }
    setViewBookingsDialog(true);
  };

  const handleAddSession = async () => {
    if (!subject || !details || !datetime) {
      console.error('Missing required fields:', { subject, details, datetime });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      console.log('Sending request with data:', {
        subject,
        details,
        datetime: datetime.toISOString(),
        duration,
        maxStudents,
        teacherId: 1
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject,
          details,
          datetime: datetime.toISOString(),
          duration,
          maxStudents,
          teacherId: 1
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        console.error('Failed to create session:', responseData);
        return;
      }

      setSessions(prev => [...prev, responseData]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSubject('');
    setDetails('');
    setDatetime(dayjs());
    setDuration(60);
    setMaxStudents(10);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', background: '#f5f5f5', p: 0, m: 0 }}>
      <AppBar position="static" color="primary" elevation={0} sx={{ width: '100vw', left: 0 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Teacher Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100vw', maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary">
              Teacher Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your teaching sessions and track student bookings
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Add New Session
          </Button>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Sessions
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {sessions.length}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Bookings
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {sessions.reduce((acc, session) => acc + session.currentBookings, 0)}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upcoming Sessions
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {sessions.filter(s => dayjs(s.datetime).isAfter(dayjs())).length}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Average Bookings
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {sessions.length ? Math.round(sessions.reduce((acc, session) => acc + session.currentBookings, 0) / sessions.length) : 0}
            </Typography>
          </Paper>
        </Box>

        {/* Sessions Grid */}
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Your Teaching Sessions
        </Typography>
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
              <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                <Box>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleViewBookings(session)}
                >
                  View Bookings
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Add Session Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Teaching Session</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Subject Name"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics"
              required
            />
            <TextField
              label="Session Details"
              fullWidth
              multiline
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what will be covered in this session"
              required
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date and Time"
                value={datetime}
                onChange={setDatetime}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Duration (minutes)"
              type="number"
              fullWidth
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              InputProps={{ inputProps: { min: 30, max: 180 } }}
              required
            />
            <TextField
              label="Maximum Students"
              type="number"
              fullWidth
              value={maxStudents}
              onChange={(e) => setMaxStudents(Number(e.target.value))}
              InputProps={{ inputProps: { min: 1, max: 50 } }}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddSession} 
            variant="contained" 
            disabled={loading || !subject || !details || !datetime}
          >
            {loading ? 'Adding...' : 'Add Session'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Bookings Dialog */}
      <Dialog 
        open={viewBookingsDialog} 
        onClose={() => setViewBookingsDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Bookings for {selectedSession?.subject}
        </DialogTitle>
        <DialogContent>
          {selectedSession?.bookings && selectedSession.bookings.length > 0 ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {selectedSession.bookings.map((booking) => (
                <Paper key={booking.id} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {booking.studentName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Booked on: {dayjs(booking.bookingDate).format('MMM D, YYYY h:mm A')}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              No bookings yet
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewBookingsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard; 
