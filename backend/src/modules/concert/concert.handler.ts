import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ConcertService } from './concert.service';
import { Concert } from './concert.repository';

export class CreateConcertDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(1)
    totalSeats: number;
}

@Injectable()
export class ConcertHandler {
    constructor(private readonly concertService: ConcertService) { }

    async handleCreateConcert(dto: CreateConcertDto): Promise<Concert> {
        if (!dto.name || !dto.description || !dto.totalSeats) {
            throw new BadRequestException('Invalid concert data');
        }
        return this.concertService.createConcert({
            name: dto.name,
            description: dto.description,
            totalSeats: dto.totalSeats,
        });
    }

    async handleDeleteConcert(id: string): Promise<{ success: boolean; message: string }> {
        try {
            await this.concertService.deleteConcert(id);
            return { success: true, message: 'Concert deleted successfully' };
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw new BadRequestException('Failed to delete concert');
        }
    }

    async handleGetAllConcerts(): Promise<Concert[]> {
        return this.concertService.getAllConcerts();
    }
}
