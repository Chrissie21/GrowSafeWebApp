import React from 'react';
import { Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '../components/AuthProvider';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Safely convert total to a number with a fallback
    const total = typeof user.total === 'number' ? user.total : parseFloat(user.total as string) || 0;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" color="secondary" gutterBottom>GrowSafe Investments</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Card sx={{ width: { xs: '100%', sm: 300 }, bgcolor: '#26A69A', color: 'white' }}>
                    <CardContent>
                        <Typography variant="h6">Total Balance</Typography>
                        <Typography variant="h4">${total.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ width: { xs: '100%', sm: 300 }, bgcolor: '#26A69A', color: 'white' }}>
                    <CardContent>
                        <Typography variant="h6">Daily Earnings</Typography>
                        <Typography variant="h4">${user.dailyEarnings.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Box>
            <Card sx={{ mt: 4, p: 2 }}>
                <Typography variant="h5" color="secondary">Investments</Typography>
                {user.investments.length === 0 ? (
                    <Typography color="textSecondary" sx={{ mt: 2 }}>No Investments Yet</Typography>
                ) : (
                    <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto' }}>
                        {user.investments.map((inv, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                <Typography>{inv.name}</Typography>
                                <Typography>Amount: ${inv.amount.toFixed(2)}</Typography>
                                <Typography color="primary">{(inv.dailyReturnRate * 100).toFixed(1)}%</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Card>
            <Card sx={{ mt: 4, p: 2 }}>
                <Typography variant="h5" color="secondary">Market Insights</Typography>
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                    Stay tuned for real-time market updates and personalized recommendations.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Learn More</Button>
            </Card>
        </Box>
    );
};

export default DashboardPage;