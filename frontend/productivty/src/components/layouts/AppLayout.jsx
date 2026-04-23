// src/components/layouts/AppLayout.jsx
import React from 'react';
import Box from '@mui/material/Box';
import MainNavBar from '../common/Main_NavBar';
import Sidebar from '../focus-wishwaka/Sidebar';

const AppLayout = ({ children, sidebar = true }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ ml: { md: sidebar ? '240px' : 0 } }}>
        <MainNavBar />
      </Box>
      <Box sx={{ display: 'flex' }}>
        {sidebar && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: sidebar ? { md: `calc(100% - 240px)` } : '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
