// dashboard/SignupPage.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Card } from '@mui/material';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarProvider';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup(username, email, password, confirmPassword);
      showSnackbar('Signed up successfully! Please log in.', 'success');
      navigate('/login');
    } catch {
      showSnackbar('Signup failed. Check your inputs.', 'error');
    }
  };

  return (
      <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default',
            background: 'linear-gradient(135deg, #1A3C34 0%, #0A1F44 100%)',
            p: { xs: 2, sm: 0 },
          }}
      >
        <Card
            sx={{
              width: { xs: '100%', sm: 400 },
              p: { xs: 2, sm: 4 },
              bgcolor: 'white',
              borderRadius: '16px',
              animation: 'fadeIn 0.5s ease-in',
            }}
        >
          <Typography variant="h4" color="primary" textAlign="center" gutterBottom sx={{ fontWeight: 700 }}>
            Sign Up for GrowSafe
          </Typography>
          <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
              sx={{ bgcolor: 'grey.50', borderRadius: '8px' }}
          />
          {/* Add similar TextFields for email, password, confirmPassword */}
          <Button
              variant="contained"
              fullWidth
              onClick={handleSignup}
              disabled={isLoading}
              sx={{ mt: 3, py: 1.5, bgcolor: 'primary.main', fontWeight: 600 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          <Button
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Already have an account? Login
          </Button>
        </Card>
      </Box>
  );
};

export default SignupPage;