import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { theme } from './theme';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { SnackbarProvider } from './components/SnackbarProvider';
import MainLayout from './components/MainLayout';



const App: React.FC = () => {
  return (
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/*" element={<MainLayout />} />
              </Routes>
            </Router>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
  );
};

export default App;