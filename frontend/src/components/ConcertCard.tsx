'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface ConcertCardProps {
    id: string;
    title: string;
    description: string;
    capacity: number;
    onDelete: (id: string) => void;
}

export default function ConcertCard({ id, title, description, capacity, onDelete }: ConcertCardProps) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
                <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
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
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        onClick={() => onDelete(id)}
                        sx={{ textTransform: 'none', px: 3, borderRadius: 1.5, bgcolor: '#e53935' }}
                        disableElevation
                    >
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
