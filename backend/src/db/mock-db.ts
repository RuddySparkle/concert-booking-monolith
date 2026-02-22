import { Concert } from '../modules/concert/concert.repository';
import { Reservation } from '../modules/reservation/reservation.repository';

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'user';
}

export const MockDB = {
    users: [
        { id: 'admin-1', name: 'Admin', role: 'admin' },
        { id: 'user-1', name: 'User 1', role: 'user' },
        { id: 'user-2', name: 'User 2', role: 'user' },
    ] as User[],
    concerts: [] as Concert[],
    reservations: [] as Reservation[],
};
