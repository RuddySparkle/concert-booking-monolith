'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, CircularProgress, Alert,
  Snackbar, Dialog, DialogContent, DialogActions,
  Button, TextField, Paper, InputAdornment
} from '@mui/material';
import StatCard from '@/components/StatCard';
import ConcertCard from '@/components/ConcertCard';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import { getAllConcerts, deleteConcert, createConcert, Concert } from '@/api/concerts';

export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [concertToDelete, setConcertToDelete] = useState<{ id: string, name: string } | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Create Form State
  const [createForm, setCreateForm] = useState({ name: '', description: '', totalSeats: '' });
  const [createLoading, setCreateLoading] = useState(false);

  // Stats
  const totalSeats = concerts.reduce((acc, curr) => acc + curr.totalSeats, 0);
  const reservedSeats = concerts.reduce((acc, curr) => acc + (curr.totalSeats - curr.availableSeats), 0);
  const canceledSeats = 12; // Mocked

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    setLoading(true);
    try {
      const data = await getAllConcerts();
      setConcerts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch concerts.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setConcertToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!concertToDelete) return;

    try {
      await deleteConcert(concertToDelete.id);
      setConcerts((prev) => prev.filter((c) => c.id !== concertToDelete.id));
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Delete successfully', severity: 'success' });
      setConcertToDelete(null);
    } catch (err) {
      console.error('Delete failed', err);
      setSnackbar({ open: true, message: 'Failed to delete concert', severity: 'error' });
      setDeleteDialogOpen(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.totalSeats) return;

    setCreateLoading(true);
    try {
      await createConcert({
        name: createForm.name,
        description: createForm.description,
        totalSeats: parseInt(createForm.totalSeats, 10)
      });
      setSnackbar({ open: true, message: 'Create successfully', severity: 'success' });
      setCreateForm({ name: '', description: '', totalSeats: '' });
      setTabIndex(0);
      fetchConcerts();
    } catch (err) {
      console.error('Create failed', err);
      setSnackbar({ open: true, message: 'Failed to create concert', severity: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
        Admin - Home
      </Typography>

      {/* Stats Row */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
        <StatCard title="Total of seats" value={totalSeats} color="#0277bd" icon={<PersonOutlineOutlinedIcon fontSize="large" />} />
        <StatCard title="Reserve" value={reservedSeats} color="#00897b" icon={<BookmarksOutlinedIcon fontSize="large" />} />
        <StatCard title="Cancel" value={canceledSeats} color="#e53935" icon={<CancelOutlinedIcon fontSize="large" />} />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(_, newIdx) => setTabIndex(newIdx)} textColor="primary" indicatorColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 600, fontSize: 16 }} />
          <Tab label="Create" sx={{ textTransform: 'none', fontWeight: 600, fontSize: 16 }} />
        </Tabs>
      </Box>

      {/* Tab content */}
      {tabIndex === 0 && (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : concerts.length === 0 ? (
            <Typography color="text.secondary">No concerts available.</Typography>
          ) : (
            concerts.map((c) => (
              <ConcertCard
                key={c.id}
                id={c.id}
                title={c.name}
                description={c.description || 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a.'}
                capacity={c.totalSeats}
                onDelete={() => confirmDelete(c.id, c.name)}
              />
            ))
          )}
        </Box>
      )}

      {tabIndex === 1 && (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
            Create
          </Typography>
          <form onSubmit={handleCreate}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>Concert Name</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Please input concert name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>Total of seat</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="500"
                  value={createForm.totalSeats}
                  onChange={(e) => setCreateForm({ ...createForm, totalSeats: e.target.value })}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlineOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" fontWeight="500" sx={{ mb: 1 }}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Please input description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                disableElevation
                disabled={createLoading}
                sx={{ textTransform: 'none', px: 4, borderRadius: 1.5 }}
              >
                Save
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 320 } }}>
        <DialogContent sx={{ textAlign: 'center' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Are you sure to delete?
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            &quot;{concertToDelete?.name}&quot;
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit" sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disableElevation sx={{ textTransform: 'none', borderRadius: 2, px: 3, bgcolor: '#e53935' }}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" /> }} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
