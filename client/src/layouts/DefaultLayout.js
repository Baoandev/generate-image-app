import React from 'react';
import Header from '../components/Header';
import { Container, Grid2, Box } from '@mui/material';

const DefaultLayout = ({ children }) => {
    return (
        <Box component='div' sx={{ padding: 0, width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Grid2 container sx={{ flexGrow: 1 }}>
                {children}
            </Grid2>
        </Box>
    )
}

export default DefaultLayout