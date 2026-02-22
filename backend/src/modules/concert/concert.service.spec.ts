import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { ConcertRepository } from './concert.repository';
import { NotFoundException } from '@nestjs/common';

describe('ConcertService', () => {
    let service: ConcertService;
    let repository: ConcertRepository;

    const mockConcertRepo = {
        create: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConcertService,
                { provide: ConcertRepository, useValue: mockConcertRepo },
            ],
        }).compile();

        service = module.get<ConcertService>(ConcertService);
        repository = module.get<ConcertRepository>(ConcertRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createConcert', () => {
        it('should create a concert with availableSeats equal to totalSeats', async () => {
            const data = { name: 'A', description: 'B', totalSeats: 100 };
            const expectedConcert = { id: '123', ...data, availableSeats: 100 };
            mockConcertRepo.create.mockResolvedValue(expectedConcert);

            const result = await service.createConcert(data);
            expect(result).toEqual(expectedConcert);
            expect(mockConcertRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                name: 'A',
                description: 'B',
                totalSeats: 100,
                availableSeats: 100,
            }));
        });
    });

    describe('deleteConcert', () => {
        it('should delete a concert if it exists', async () => {
            mockConcertRepo.delete.mockResolvedValue(true);
            await expect(service.deleteConcert('1')).resolves.toBeUndefined();
            expect(mockConcertRepo.delete).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundException if concert does not exist', async () => {
            mockConcertRepo.delete.mockResolvedValue(false);
            await expect(service.deleteConcert('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getAllConcerts', () => {
        it('should return all concerts', async () => {
            const concerts = [{ id: '1', name: 'A', description: 'B', totalSeats: 10, availableSeats: 10 }];
            mockConcertRepo.findAll.mockResolvedValue(concerts);

            const result = await service.getAllConcerts();
            expect(result).toEqual(concerts);
            expect(mockConcertRepo.findAll).toHaveBeenCalled();
        });
    });

    describe('getConcertById', () => {
        it('should return a concert by id', async () => {
            const concert = { id: '1', name: 'A', description: 'B', totalSeats: 10, availableSeats: 10 };
            mockConcertRepo.findById.mockResolvedValue(concert);

            const result = await service.getConcertById('1');
            expect(result).toEqual(concert);
        });

        it('should throw NotFoundException if concert not found', async () => {
            mockConcertRepo.findById.mockResolvedValue(undefined);
            await expect(service.getConcertById('1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('reserveSeat', () => {
        it('should decrease availableSeats by 1', async () => {
            const concert = { id: '1', name: 'A', description: 'B', totalSeats: 10, availableSeats: 10 };
            mockConcertRepo.findById.mockResolvedValue(concert);
            mockConcertRepo.update.mockResolvedValue({ ...concert, availableSeats: 9 });

            await service.reserveSeat('1');
            expect(mockConcertRepo.update).toHaveBeenCalledWith('1', { availableSeats: 9 });
        });

        it('should throw an Error if no available seats', async () => {
            const concert = { id: '1', name: 'A', description: 'B', totalSeats: 10, availableSeats: 0 };
            mockConcertRepo.findById.mockResolvedValue(concert);

            await expect(service.reserveSeat('1')).rejects.toThrow('No available seats');
        });
    });

    describe('cancelSeat', () => {
        it('should increase availableSeats by 1', async () => {
            const concert = { id: '1', name: 'A', description: 'B', totalSeats: 10, availableSeats: 9 };
            mockConcertRepo.findById.mockResolvedValue(concert);
            mockConcertRepo.update.mockResolvedValue({ ...concert, availableSeats: 10 });

            await service.cancelSeat('1');
            expect(mockConcertRepo.update).toHaveBeenCalledWith('1', { availableSeats: 10 });
        });
    });
});
