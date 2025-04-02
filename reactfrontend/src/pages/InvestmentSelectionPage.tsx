import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, CardActionArea, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../components/AuthProvider';

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
  const [selectedOption, setSelectedOption] = useState<{ name: string; dailyReturnRate: number; minAmount: number } | null>(null);
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleInvest = async () => {
    const amountNum = parseFloat(amount);
    if (selectedOption && amountNum >= selectedOption.minAmount && amountNum <= user.total) {
      await invest(selectedOption.name, amountNum, selectedOption.dailyReturnRate);
      setOpen(false);
      setAmount('');
    } else {
      alert(amountNum < (selectedOption?.minAmount || 0) ? 'Amount below minimum!' : 'Insufficient balance!');
    }
  };

  // @ts-ignore
  // @ts-ignore
  return (
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h4" color="secondary" gutterBottom>Choose Your Investment Plan</Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          {investmentOptions.map((option) => (
              <Card key={option.name} sx={{ bgcolor: '#26A69A', color: 'white' }}>
                <CardActionArea onClick={() => { setSelectedOption(option); setOpen(true); }}>
                  <CardContent>
                    <Typography variant="h6">{option.name}</Typography>
                    <Typography>Return: {(option.dailyReturnRate * 100).toFixed(1)}%</Typography>
                    <Typography>Min: ${option.minAmount.toFixed(2)}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
          ))}
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)}>
          {selectedOption ? (
              <>
                <DialogTitle>Invest in {selectedOption.name}</DialogTitle>
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
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleInvest} variant="contained">Invest</Button>
                </DialogActions>
              </>
          ) : null}
        </Dialog>
      </Box>
  );
};

export default InvestmentSelectionPage;