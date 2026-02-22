import { Injectable } from '@nestjs/common';
import { MockDB } from '../../db/mock-db';

export interface Reservation {
    id: string;
    userId: string;
    concertId: string;
    status: 'RESERVED' | 'CANCELLED';
    createdAt: Date;
}

@Injectable()
export class ReservationRepository {
    async create(reservation: Reservation): Promise<Reservation> {
        MockDB.reservations.push(reservation);
        return reservation;
    }

    async delete(id: string): Promise<boolean> {
        const index = MockDB.reservations.findIndex((r) => r.id === id);
        if (index === -1) {
            return false;
        }
        MockDB.reservations.splice(index, 1);
        return true;
    }

    async findById(id: string): Promise<Reservation | undefined> {
        return MockDB.reservations.find((r) => r.id === id);
    }

    async findByUserId(userId: string): Promise<Reservation[]> {
        return MockDB.reservations.filter((r) => r.userId === userId);
    }

    async findByUserIdAndConcertId(userId: string, concertId: string): Promise<Reservation | undefined> {
        return MockDB.reservations.find((r) => r.userId === userId && r.concertId === concertId && r.status === 'RESERVED');
    }

    async updateStatus(id: string, status: 'RESERVED' | 'CANCELLED'): Promise<Reservation | null> {
        const reservation = await this.findById(id);
        if (!reservation) return null;

        reservation.status = status;
        return reservation;
    }
}
