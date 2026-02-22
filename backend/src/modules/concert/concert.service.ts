import { Injectable, NotFoundException } from '@nestjs/common';
import { ConcertRepository } from './concert.repository';
import { Concert } from './concert.repository';

@Injectable()
export class ConcertService {
    constructor(private readonly concertRepository: ConcertRepository) { }

    async createConcert(data: Omit<Concert, 'id' | 'availableSeats'>): Promise<Concert> {
        const newConcert: Concert = {
            id: Date.now().toString(),
            ...data,
            availableSeats: data.totalSeats,
        };
        return this.concertRepository.create(newConcert);
    }

    async deleteConcert(id: string): Promise<void> {
        const deleted = await this.concertRepository.delete(id);
        if (!deleted) {
            throw new NotFoundException('Concert not found');
        }
    }

    async getAllConcerts(): Promise<Concert[]> {
        return this.concertRepository.findAll();
    }

    async getConcertById(id: string): Promise<Concert> {
        const concert = await this.concertRepository.findById(id);
        if (!concert) {
            throw new NotFoundException('Concert not found');
        }
        return concert;
    }

    async reserveSeat(id: string): Promise<void> {
        const concert = await this.getConcertById(id);
        if (concert.availableSeats <= 0) {
            throw new Error('No available seats');
        }
        await this.concertRepository.update(id, { availableSeats: concert.availableSeats - 1 });
    }

    async cancelSeat(id: string): Promise<void> {
        const concert = await this.getConcertById(id);
        await this.concertRepository.update(id, { availableSeats: concert.availableSeats + 1 });
    }
}
