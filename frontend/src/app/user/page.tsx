'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getAllConcerts, Concert } from '@/api/concerts';
import { getOwnReservations, reserveSeat, cancelSeat, Reservation } from '@/api/reservations';
import UserConcertCard from '@/components/UserConcertCard';

export default function UserPage() {
    const [concerts, setConcerts] = useState<Concert[]>([]);
    const [reservations, setReservations] = useState<Record<string, Reservation>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch concerts independently (using user's header role)
            const [concertsData, reservationsData] = await Promise.all([
                getAllConcerts('user-1'),
                getOwnReservations('user-1')
            ]);

            setConcerts(concertsData);

            // Map active reservations by concertId for quick access
            const activeResMap: Record<string, Reservation> = {};
            reservationsData.forEach(r => {
                if (r.status === 'RESERVED') {
                    activeResMap[r.concertId] = r;
                }
            });
            setReservations(activeResMap);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async (concertId: string) => {
        try {
            const newRes = await reserveSeat(concertId, 'user-1');
            setReservations(prev => ({ ...prev, [concertId]: newRes }));
            setSnackbar({ open: true, message: 'Reserved successfully', severity: 'success' });
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to reserve seat';
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleCancel = async (concertId: string) => {
        const reservation = reservations[concertId];
        if (!reservation) return;

        try {
            await cancelSeat(reservation.id, 'user-1');
            setReservations(prev => {
                const nextState = { ...prev };
                delete nextState[concertId];
                return nextState;
            });
            setSnackbar({ open: true, message: 'Canceled successfully', severity: 'success' });
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: 'Failed to cancel seat', severity: 'error' });
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
                User
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : concerts.length === 0 ? (
                <Typography color="text.secondary">No concerts available right now.</Typography>
            ) : (
                concerts.map(c => (
                    <UserConcertCard
                        key={c.id}
                        id={c.id}
                        title={c.name}
                        description={c.description || 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a.'}
                        capacity={c.totalSeats}
                        isReserved={!!reservations[c.id]}
                        onReserve={handleReserve}
                        onCancel={handleCancel}
                    />
                ))
            )}

            {/* Snackbar notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" /> }} sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
