import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertModule } from './modules/concert/concert.module';
import { ReservationModule } from './modules/reservation/reservation.module';

@Module({
  imports: [ConcertModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
