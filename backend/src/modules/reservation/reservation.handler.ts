import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.repository';

export class ReserveSeatDto {
    @IsString()
    @IsNotEmpty()
    concertId: string;
}

@Injectable()
export class ReservationHandler {
    constructor(private readonly reservationService: ReservationService) { }

    async handleReserveSeat(userId: string, dto: ReserveSeatDto): Promise<Reservation> {
        if (!userId || !dto.concertId) {
            throw new BadRequestException('userId and concertId are required');
        }
        return this.reservationService.reserveSeat(userId, dto.concertId);
    }

    async handleCancelSeat(userId: string, reservationId: string): Promise<Reservation> {
        if (!userId || !reservationId) {
            throw new BadRequestException('userId and reservationId are required');
        }
        return this.reservationService.cancelReservation(reservationId, userId);
    }

    async handleGetUserReservations(userId: string): Promise<Reservation[]> {
        return this.reservationService.getUserReservations(userId);
    }
}
