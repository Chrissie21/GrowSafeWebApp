import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarState {
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
    open: boolean;
}

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: SnackbarState['severity']) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({ message: '', severity: 'info', open: false });

    const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'info') => {
        setSnackbar({ message, severity, open: true });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within a SnackbarProvider');
    return context;
};