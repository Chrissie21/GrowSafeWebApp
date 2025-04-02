import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#26A69A' }, // Teal from Flutter
    secondary: { main: '#1A3C34' }, // Dark green
    background: { default: '#F5F7FA' },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
  },
});