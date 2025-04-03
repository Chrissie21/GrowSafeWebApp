// pages/InvestmentSelectionPage.tsx
import React, { useState } from 'react';
import { Typography, Box, Grid, Card, CardContent, CardActionArea, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../components/AuthProvider';
import { useSnackbar } from '../components/SnackbarProvider';

const investmentOptions = [
  { name: 'Plan A', dailyReturnRate: 0.03, minAmount: 10.0 },
  { name: 'Plan B', dailyReturnRate: 0.05, minAmount: 50.0 },
  { name: 'Plan C', dailyReturnRate: 0.07, minAmount: 100.0 },
  { name: 'Plan D', dailyReturnRate: 0.10, minAmount: 500.0 },
  { name: 'Plan E', dailyReturnRate: 0.12, minAmount: 1000.0 },
  { name: 'Plan F', dailyReturnRate: 0.15, minAmount: 5000.0 },
  { name: 'Plan G', dailyReturnRate: 0.20, minAmount: 10000.0 },
  { name: 'Plan H', dailyReturnRate: 0.25, minAmount: 50000.0 },
];

const InvestmentSelectionPage: React.FC = () => {
  const { user, invest } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [selectedOption, setSelectedOption] = useState<{ name: string; dailyReturnRate: number; minAmount: number } | null>(null);
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleInvest = async () => {
    const amountNum = parseFloat(amount);
    if (selectedOption && amountNum >= selectedOption.minAmount && amountNum <= user.total) {
      await invest(selectedOption.name, amountNum, selectedOption.dailyReturnRate);
      showSnackbar(`Successfully invested $${amountNum} in ${selectedOption.name}`, 'success');
      setOpen(false);
      setAmount('');
    } else {
      showSnackbar(
          amountNum < (selectedOption?.minAmount || 0) ? 'Amount below minimum!' : 'Insufficient balance!',
          'error'
      );
    }
  };

  return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'transparent', minHeight: '100vh' }}>
        <Typography variant="h4" color="secondary" gutterBottom sx={{ fontWeight: 700, animation: 'fadeIn 0.5s ease-in' }}>
          Choose Your Investment Plan
        </Typography>
        <Grid container spacing={2}>
          {investmentOptions.map((option, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={option.name}>
                <Card sx={{ bgcolor: 'primary.main', color: 'white', animation: `slideIn 0.3s ease-in ${index * 0.1}s both` }}>
                  <CardActionArea onClick={() => { setSelectedOption(option); setOpen(true); }}>
                    <CardContent>
                      <Typography variant="h6">{option.name}</Typography>
                      <Typography>Return: {(option.dailyReturnRate * 100).toFixed(1)}%</Typography>
                      <Typography>Min: ${option.minAmount.toFixed(2)}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}>
          {selectedOption ? (
              <>
                <DialogTitle sx={{ fontWeight: 600 }}>Invest in {selectedOption.name}</DialogTitle>
                <DialogContent>
                  <Typography>Daily Return: {(selectedOption.dailyReturnRate * 100).toFixed(1)}%</Typography>
                  <Typography>Min Amount: ${selectedOption.minAmount.toFixed(2)}</Typography>
                  <Typography>Available Balance: ${user.total.toFixed(2)}</Typography>
                  <TextField
                      label="Amount to Invest"
                      type="number"
                      value={amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputProps={{ inputProps: { min: selectedOption.minAmount } }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                  <Button onClick={handleInvest} variant="contained" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                    Invest
                  </Button>
                </DialogActions>
              </>
          ) : null}
        </Dialog>
      </Box>
  );
};

export default InvestmentSelectionPage;