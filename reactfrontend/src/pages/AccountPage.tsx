import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../components/AuthProvider';

const AccountPage: React.FC = () => {
  const { user, deposit, withdraw } = useAuth();
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  if (!user) return null;

  const handleDeposit = async () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      await deposit(amountNum);
      setOpenDeposit(false);
      setAmount('');
    } else {
      alert('Enter a valid amount!');
    }
  };

  const handleWithdraw = async () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0 && amountNum <= user.total) {
      await withdraw(amountNum);
      setOpenWithdraw(false);
      setAmount('');
    } else {
      alert(amountNum <= 0 ? 'Enter a valid amount!' : 'Insufficient balance!');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" color="secondary" gutterBottom>My Account</Typography>
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">{user.userId}</Typography>
          <Typography color="textSecondary">ID: {user.id}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <CardContent>
            <Typography variant="h6" color="primary">${user.total.toFixed(2)}</Typography>
            <Typography>Total</Typography>
          </CardContent>
          <CardContent>
            <Typography variant="h6" color="primary">${user.totalDeposit.toFixed(2)}</Typography>
            <Typography>Deposits</Typography>
          </CardContent>
          <CardContent>
            <Typography variant="h6" color="primary">${user.totalWithdraw.toFixed(2)}</Typography>
            <Typography>Withdrawals</Typography>
          </CardContent>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => setOpenDeposit(true)}>Deposit</Button>
        <Button variant="contained" onClick={() => setOpenWithdraw(true)}>Withdraw</Button>
      </Box>

      <Dialog open={openDeposit} onClose={() => setOpenDeposit(false)}>
        <DialogTitle>Deposit Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeposit(false)}>Cancel</Button>
          <Button onClick={handleDeposit} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openWithdraw} onClose={() => setOpenWithdraw(false)}>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWithdraw(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;