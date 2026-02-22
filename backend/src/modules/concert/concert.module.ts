import { Module } from '@nestjs/common';
import { ConcertRepository } from './concert.repository';
import { ConcertService } from './concert.service';
import { ConcertHandler } from './concert.handler';
import { ConcertController } from './concert.controller';

@Module({
    controllers: [ConcertController],
    providers: [ConcertRepository, ConcertService, ConcertHandler],
    exports: [ConcertService], // export if other modules need to interact with concerts
})
export class ConcertModule { }
