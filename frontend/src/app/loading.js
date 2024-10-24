import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
