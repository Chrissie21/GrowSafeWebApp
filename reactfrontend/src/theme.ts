import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#26A69A', contrastText: '#FFFFFF' },
    secondary: { main: '#FFCA28', contrastText: '#1A3C34' },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A3C34',
      secondary: '#607D8B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 700, fontSize: '2rem', '@media (max-width:600px)': { fontSize: '1.5rem' } },
    h5: { fontWeight: 600, fontSize: '1.5rem', '@media (max-width:600px)': { fontSize: '1.25rem' } },
    h6: { fontWeight: 600, fontSize: '1.25rem', '@media (max-width:600px)': { fontSize: '1rem' } },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', color: '#607D8B' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(90deg, #26A69A 0%, #4DB6AC 100%)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});