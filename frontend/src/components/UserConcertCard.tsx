'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

interface UserConcertCardProps {
    id: string;
    title: string;
    description: string;
    capacity: number;
    isReserved: boolean;
    onReserve: (id: string) => void;
    onCancel: (id: string) => void;
}

export default function UserConcertCard({ id, title, description, capacity, isReserved, onReserve, onCancel }: UserConcertCardProps) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                    {description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <PersonOutlineOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{capacity}</Typography>
                    </Box>
                    {isReserved ? (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onCancel(id)}
                            sx={{ textTransform: 'none', px: 3, borderRadius: 1.5, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                            disableElevation
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onReserve(id)}
                            sx={{ textTransform: 'none', px: 3, borderRadius: 1.5, bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1565c0' } }}
                            disableElevation
                        >
                            Reserve
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
