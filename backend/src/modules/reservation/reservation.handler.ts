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

    async handleCancelSeat(userId: string, reservationId: string): Promise<{ success: boolean; message: string }> {
        try {
            await this.reservationService.cancelReservation(reservationId, userId);
            return { success: true, message: 'Seat cancelled successfully' };
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw new BadRequestException('Failed to cancel seat: ' + (e instanceof Error ? e.message : 'Unknown error'));
        }
    }

    async handleGetUserReservations(userId: string): Promise<Reservation[]> {
        return this.reservationService.getUserReservations(userId);
    }
}
