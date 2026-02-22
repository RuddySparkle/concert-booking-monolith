import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { ConcertService } from '../concert/concert.service';
import { Reservation } from './reservation.repository';

@Injectable()
export class ReservationService {
    constructor(
        private readonly reservationRepository: ReservationRepository,
        private readonly concertService: ConcertService,
    ) { }

    async reserveSeat(userId: string, concertId: string): Promise<Reservation> {
        // 1 seat per 1 user (per concert)
        const existingReservation = await this.reservationRepository.findByUserIdAndConcertId(userId, concertId);
        if (existingReservation) {
            throw new BadRequestException('User has already reserved a seat for this concert');
        }

        // Get concert details for snapshot
        const concert = await this.concertService.getConcertById(concertId);

        // Reserve seat in concert
        try {
            await this.concertService.reserveSeat(concertId);
        } catch (e) {
            throw new BadRequestException(e instanceof Error ? e.message : 'Failed to reserve seat');
        }

        const reservation: Reservation = {
            id: Date.now().toString(),
            userId,
            concertId,
            concertName: concert?.name,
            status: 'RESERVED',
            createdAt: new Date(),
        };

        return this.reservationRepository.create(reservation);
    }

    async cancelReservation(id: string, userId?: string): Promise<Reservation> {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation || reservation.status === 'CANCELLED') {
            throw new NotFoundException('Active reservation not found');
        }

        // Ensure user owns the reservation or it's an admin (in a real app)
        if (userId && reservation.userId !== userId) {
            throw new BadRequestException('Cannot cancel reservation belonging to another user');
        }

        // Cancel seat in concert
        await this.concertService.cancelSeat(reservation.concertId);

        // Create a new cancellation log entry instead of updating the existing reservation
        const cancelLog: Reservation = {
            id: Date.now().toString(),
            userId: reservation.userId,
            concertId: reservation.concertId,
            concertName: reservation.concertName, // Preserve the concert name snapshot
            status: 'CANCELLED',
            createdAt: new Date(),
        };

        return this.reservationRepository.create(cancelLog);
    }

    async getUserReservations(userId: string): Promise<Reservation[]> {
        if (!userId) {
            throw new BadRequestException('UserId is required');
        }
        return this.reservationRepository.findByUserId(userId);
    }
}
