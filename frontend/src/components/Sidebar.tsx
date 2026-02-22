'use client';

import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

interface SidebarProps {
    mobileOpen?: boolean;
    handleDrawerToggle?: () => void;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
    const pathname = usePathname();
    const isUser = pathname.startsWith('/user');

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Box>
                <Box sx={{ p: 3, pb: 2, display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="h5" fontWeight="bold">
                        {isUser ? 'User' : 'Admin'}
                    </Typography>
                </Box>
                <List sx={{ pt: { xs: 2, sm: 0 } }}>
                    {!isUser && (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href="/"
                                    onClick={handleDrawerToggle}
                                    sx={{ mx: 2, borderRadius: 2, backgroundColor: pathname === '/' ? '#f0f7ff' : 'transparent', '&:hover': { backgroundColor: '#f0f7ff' } }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: pathname === '/' ? 'primary.main' : 'text.primary' }}>
                                        <HomeOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: pathname === '/' ? 600 : 500 }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href="/admin/history"
                                    onClick={handleDrawerToggle}
                                    sx={{ mx: 2, borderRadius: 2, backgroundColor: pathname === '/admin/history' ? '#f0f7ff' : 'transparent', '&:hover': { backgroundColor: '#f0f7ff' } }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: pathname === '/admin/history' ? 'primary.main' : 'inherit' }}>
                                        <HistoryOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="History" primaryTypographyProps={{ fontWeight: pathname === '/admin/history' ? 600 : 500 }} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}

                    <ListItem disablePadding sx={{ mt: 2 }}>
                        <ListItemButton
                            component={Link}
                            href={isUser ? "/" : "/user"}
                            onClick={handleDrawerToggle}
                            sx={{ mx: 2, borderRadius: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <SwapHorizOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary={isUser ? "Switch to Admin" : "Switch to user"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Box sx={{ pb: 3 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ mx: 2, borderRadius: 2 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <LogoutOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // Better open performance on mobile.
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #eaeaea' },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}
