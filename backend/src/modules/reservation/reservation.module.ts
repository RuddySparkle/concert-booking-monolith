import { Module } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';
import { ReservationHandler } from './reservation.handler';
import { ReservationController } from './reservation.controller';
import { ConcertModule } from '../concert/concert.module';

@Module({
    imports: [ConcertModule],
    controllers: [ReservationController],
    providers: [ReservationRepository, ReservationService, ReservationHandler],
    exports: [ReservationService],
})
export class ReservationModule { }
