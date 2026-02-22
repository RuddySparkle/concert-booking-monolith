'use client';

import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <CssBaseline />

            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - 240px)` } }}>
                <AppBar
                    position="static"
                    sx={{
                        display: { sm: 'none' }, // Only show on mobile
                        bgcolor: 'white',
                        color: 'black',
                        boxShadow: 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" fontWeight="bold">
                            {pathname.startsWith('/user') ? 'User' : 'Admin'}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Main Content Area */}
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
