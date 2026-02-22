import axiosClient from './axiosClient';

export interface Reservation {
    id: string;
    userId: string;
    concertId: string;
    status: 'RESERVED' | 'CANCELLED';
    createdAt: string;
}

const getConfig = (userId: string = 'user-1') => ({
    headers: {
        'User-Id': userId
    }
});

export const reserveSeat = async (concertId: string, userId: string = 'user-1') => {
    const response = await axiosClient.post('/user/reservations', { concertId }, getConfig(userId));
    return response.data;
};

export const cancelSeat = async (reservationId: string, userId: string = 'user-1') => {
    const response = await axiosClient.delete(`/user/reservations/${reservationId}`, getConfig(userId));
    return response.data;
};

export const getOwnReservations = async (userId: string = 'user-1'): Promise<Reservation[]> => {
    const response = await axiosClient.get('/user/reservations', getConfig(userId));
    return response.data;
};

export const getAdminUsersReservations = async (targetUserId: string): Promise<Reservation[]> => {
    const response = await axiosClient.get(`/admin/reservations/users/${targetUserId}`, { headers: { 'User-Id': 'admin-1' } });
    return response.data;
};
