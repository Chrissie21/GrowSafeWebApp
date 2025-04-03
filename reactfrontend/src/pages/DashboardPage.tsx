import React from 'react';
import { Typography, Box, Grid, Card, CardContent, Button, Skeleton } from '@mui/material';
import { useAuth } from '../components/AuthProvider';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
                <Skeleton variant="text" width={200} height={40} />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {[...Array(2)].map((_, index) => (
                        <Grid txs={12} sm={6} key={index}>
                            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px' }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    const total = typeof user.total === 'number' ? user.total : parseFloat(user.total as string) || 0;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'transparent', minHeight: '100vh' }}>
            <Typography variant="h4" color="secondary" gutterBottom sx={{ fontWeight: 700, animation: 'fadeIn 0.5s ease-in' }}>
                GrowSafe Investments
            </Typography>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Total Balance</Typography>
                            <Typography variant="h4" sx={{ mt: 1 }}>${total.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Daily Earnings</Typography>
                            <Typography variant="h4" sx={{ mt: 1 }}>${user.dailyEarnings.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h5" color="secondary">Investments</Typography>
                    {user.investments.length === 0 ? (
                        <Typography color="textSecondary" sx={{ mt: 2 }}>No Investments Yet</Typography>
                    ) : (
                        <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto' }}>
                            {user.investments.map((inv, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        py: 1,
                                        borderBottom: '1px solid #E0E0E0',
                                        '&:last-child': { borderBottom: 'none' },
                                        animation: `slideIn 0.3s ease-in ${index * 0.1}s both`,
                                    }}
                                >
                                    <Typography fontWeight={500}>{inv.name}</Typography>
                                    <Typography>Amount: ${inv.amount.toFixed(2)}</Typography>
                                    <Typography color="primary">{(inv.dailyReturnRate * 100).toFixed(1)}%</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h5" color="secondary">Market Insights</Typography>
                    <Typography color="textSecondary" sx={{ mt: 2 }}>
                        Stay tuned for real-time market updates and personalized recommendations.
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                        Learn More
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

// Add CSS animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// Inject styles (you can add this to a global CSS file or use a styled-components approach)
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default DashboardPage;