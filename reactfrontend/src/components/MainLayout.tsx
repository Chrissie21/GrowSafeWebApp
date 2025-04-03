import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, BottomNavigation, BottomNavigationAction, IconButton, Box, CircularProgress } from '@mui/material';
import { Dashboard, TrendingUp, AccountCircle, Logout } from '@mui/icons-material';
import { useAuth } from './AuthProvider';
import DashboardPage from '../pages/DashboardPage';
import InvestmentSelectionPage from '../pages/InvestmentSelectionPage';
import AccountPage from '../pages/AccountPage';
import { Routes, Route } from 'react-router-dom';

const MainLayout: React.FC = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const [tab, setTab] = React.useState(0);
    const isWide = window.innerWidth > 600;

    const pages = [
        { label: 'Dashboard', path: '/dashboard', component: DashboardPage, icon: <Dashboard /> },
        { label: 'Invest', path: '/invest', component: InvestmentSelectionPage, icon: <TrendingUp /> },
        { label: 'Account', path: '/account', component: AccountPage, icon: <AccountCircle /> },
    ];

    React.useEffect(() => {
        const currentPageIndex = pages.findIndex((page) => page.path === location.pathname);
        if (currentPageIndex !== -1) {
            setTab(currentPageIndex);
        }
    }, [location.pathname]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }
    if (!user) return <Navigate to="/login" />;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECEF 100%)' }}>
            <AppBar position="sticky">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>GrowSafe Investments</Typography>
                    <IconButton color="inherit" onClick={logout} aria-label="logout">
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {isWide ? (
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: { md: 240, lg: 280 },
                            flexShrink: 0,
                            '& .MuiDrawer-paper': { width: { md: 240, lg: 280 }, bgcolor: '#FFFFFF', borderRight: '1px solid #E0E0E0' },
                        }}
                    >
                        <List sx={{ pt: 2 }}>
                            {pages.map((page, index) => (
                                <ListItemButton
                                    key={page.label}
                                    selected={tab === index}
                                    onClick={() => setTab(index)}
                                    sx={{
                                        mx: 2,
                                        borderRadius: '8px',
                                        '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main' },
                                        '&:hover': { bgcolor: 'grey.100' },
                                    }}
                                >
                                    <ListItemText primary={page.label} primaryTypographyProps={{ fontWeight: 500 }} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Drawer>
                ) : null}
                <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, overflowY: 'auto' }}>
                    <Routes>
                        {pages.map((page) => (
                            <Route key={page.label} path={page.path} element={<page.component />} />
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
                    sx={{
                        bgcolor: '#FFFFFF',
                        borderTop: '1px solid #E0E0E0',
                        '& .MuiBottomNavigationAction-root': {
                            '&.Mui-selected': { color: 'primary.main' },
                        },
                    }}
                >
                    {pages.map((page) => (
                        <BottomNavigationAction key={page.label} label={page.label} icon={page.icon} />
                    ))}
                </BottomNavigation>
            )}
        </Box>
    );
};

export default MainLayout;