// src/dashboard/AccountPage.tsx
import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { useAuth } from '../components/AuthProvider';
import { useSnackbar } from '../components/SnackbarProvider';

const AccountPage: React.FC = () => {
  const { user, deposit, withdraw } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  if (!user) return null;

  const handleDeposit = async () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      await deposit(amountNum);
      showSnackbar(`Deposited $${amountNum} successfully`, 'success');
      setOpenDeposit(false);
      setAmount('');
    } else {
      showSnackbar('Enter a valid amount!', 'error');
    }
  };

  const handleWithdraw = async () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0 && amountNum <= user.total) {
      await withdraw(amountNum);
      showSnackbar(`Withdrew $${amountNum} successfully`, 'success');
      setOpenWithdraw(false);
      setAmount('');
    } else {
      showSnackbar(amountNum <= 0 ? 'Enter a valid amount!' : 'Insufficient balance!', 'error');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'transparent', minHeight: '100vh' }}>
      <Typography variant="h4" color="secondary" gutterBottom sx={{ fontWeight: 700, animation: 'fadeIn 0.5s ease-in' }}>
        My Account
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight={600}>{user.userId}</Typography>
            <Typography color="textSecondary">ID: {user.id}</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4} component="div">
              <CardContent>
                <Typography variant="h6" color="primary">${user.total.toFixed(2)}</Typography>
                <Typography color="textSecondary">Total</Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={4} component="div">
              <CardContent>
                <Typography variant="h6" color="primary">${user.totalDeposit.toFixed(2)}</Typography>
                <Typography color="textSecondary">Deposits</Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={4} component="div">
              <CardContent>
                <Typography variant="h6" color="primary">${user.totalWithdraw.toFixed(2)}</Typography>
                <Typography color="textSecondary">Withdrawals</Typography>
              </CardContent>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => setOpenDeposit(true)} sx={{ px: 4, py: 1.5 }}>
          Deposit
        </Button>
        <Button variant="contained" onClick={() => setOpenWithdraw(true)} sx={{ px: 4, py: 1.5 }}>
          Withdraw
        </Button>
      </Box>
      <Dialog open={openDeposit} onClose={() => setOpenDeposit(false)} PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>Deposit Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeposit(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDeposit} variant="contained" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openWithdraw} onClose={() => setOpenWithdraw(false)} PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>Withdraw Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{ inputProps: { min: 0, max: user.total } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWithdraw(false)} color="inherit">Cancel</Button>
          <Button onClick={handleWithdraw} variant="contained" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;