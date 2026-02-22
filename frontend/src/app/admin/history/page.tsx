'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { getAdminUsersReservations, Reservation } from '@/api/reservations';
import { getAllConcerts } from '@/api/concerts';

export default function HistoryPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch user reservations (since no global endpoint exists, we fetch 'user-1' as mock)
            const userReservations = await getAdminUsersReservations('user-1');
            // Sorting is now handled by the backend, but we ensure frontend also sorts correctly
            const sortedReservations = userReservations.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setReservations(sortedReservations);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch history data.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB'); // Format roughly matches 12/09/2024 15:00:00
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            {/* Header */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
                Admin - History
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small" aria-label="history table">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Concert name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No histories currently found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reservations.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{formatDate(row.createdAt)}</TableCell>
                                        <TableCell>Sara John</TableCell>
                                        <TableCell>{row.concertName || 'Unknown Concert'}</TableCell>
                                        <TableCell>{row.status === 'RESERVED' ? 'Reserve' : 'Cancel'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
