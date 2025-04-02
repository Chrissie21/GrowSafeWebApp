import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    await signup(username, email, password, confirmPassword);
    if (!error) navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to bottom right, #1A3C34, #0A1F44)' }}>
      <Box sx={{ width: { xs: '90%', sm: 400 }, p: 4, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
        <Typography variant="h4" color="white" textAlign="center" gutterBottom>Sign Up for GrowSafe</Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ input: { color: 'white' }, label: { color: 'white' }, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ input: { color: 'white' }, label: { color: 'white' }, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ input: { color: 'white' }, label: { color: 'white' }, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ input: { color: 'white' }, label: { color: 'white' }, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignup}
          disabled={isLoading}
          sx={{ mt: 2, bgcolor: '#26A69A' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>
        <Button color="inherit" onClick={() => navigate('/login')} sx={{ mt: 2, color: 'white' }}>
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  );
};

export default SignupPage;