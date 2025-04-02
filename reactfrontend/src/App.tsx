import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, BottomNavigation, BottomNavigationAction, IconButton, Box, CircularProgress } from '@mui/material';
import { Dashboard, TrendingUp, AccountCircle, Logout } from '@mui/icons-material';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { theme } from './theme';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InvestmentSelectionPage from './pages/InvestmentSelectionPage';
import AccountPage from './pages/AccountPage';

const MainLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [tab, setTab] = React.useState(0);
  const isWide = window.innerWidth > 600;

  const pages = [
    { label: 'Dashboard', path: '/dashboard', component: DashboardPage, icon: <Dashboard /> },
    { label: 'Invest', path: '/invest', component: InvestmentSelectionPage, icon: <TrendingUp /> },
    { label: 'Account', path: '/account', component: AccountPage, icon: <AccountCircle /> },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Navigate to="/login" />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>GrowSafe Investments</Typography>
          <IconButton color="inherit" onClick={logout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {isWide ? (
          <Drawer variant="permanent" sx={{ width: 200, flexShrink: 0, '& .MuiDrawer-paper': { width: 200 } }}>
            <List>
              {pages.map((page, index) => (
                <ListItemButton
                  key={page.label}
                  selected={tab === index}
                  onClick={() => setTab(index)}
                >
                  <ListItemText primary={page.label} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        ) : null}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {pages.map((page, index) => (
              <Route
                key={page.label}
                path={page.path}
                element={tab === index ? <page.component /> : null}
              />
            ))}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
      {!isWide && (
        <BottomNavigation
          value={tab}
          onChange={(_e, newValue) => setTab(newValue)}
          showLabels
          sx={{ width: '100%' }}
        >
          {pages.map((page) => (
            <BottomNavigationAction key={page.label} label={page.label} icon={page.icon} />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;