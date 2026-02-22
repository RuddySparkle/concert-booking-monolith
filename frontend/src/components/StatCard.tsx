'use client';

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface StatCardProps {
    title: string;
    value: string | number;
    color: string;
    icon: React.ReactNode;
}

export default function StatCard({ title, value, color, icon }: StatCardProps) {
    return (
        <Card sx={{ bgcolor: color, color: 'white', borderRadius: 2, minWidth: 200, flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', py: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {icon}
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5, opacity: 0.9 }}>
                    {title}
                </Typography>
                <Typography variant="h3" fontWeight="500">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}
