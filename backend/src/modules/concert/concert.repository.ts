import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDB } from '../../db/mock-db';

export interface Concert {
    id: string;
    name: string;
    description: string;
    totalSeats: number;
    availableSeats: number;
}

@Injectable()
export class ConcertRepository {
    async create(concert: Concert): Promise<Concert> {
        MockDB.concerts.push(concert);
        return concert;
    }

    async delete(id: string): Promise<boolean> {
        const index = MockDB.concerts.findIndex((c) => c.id === id);
        if (index === -1) {
            return false;
        }
        MockDB.concerts.splice(index, 1);
        return true;
    }

    async findAll(): Promise<Concert[]> {
        return MockDB.concerts;
    }

    async findById(id: string): Promise<Concert | undefined> {
        return MockDB.concerts.find((c) => c.id === id);
    }

    async update(id: string, updateData: Partial<Concert>): Promise<Concert | null> {
        const concert = await this.findById(id);
        if (!concert) return null;

        Object.assign(concert, updateData);
        return concert;
    }
}
