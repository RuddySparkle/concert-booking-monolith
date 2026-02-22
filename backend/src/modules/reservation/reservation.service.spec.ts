import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from './reservation.repository';
import { ConcertService } from '../concert/concert.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
    let service: ReservationService;
    let repository: ReservationRepository;
    let concertService: ConcertService;

    const mockReservationRepo = {
        create: jest.fn(),
        findById: jest.fn(),
        findByUserId: jest.fn(),
        findByUserIdAndConcertId: jest.fn(),
        updateStatus: jest.fn(),
    };

    const mockConcertService = {
        reserveSeat: jest.fn(),
        cancelSeat: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationService,
                { provide: ReservationRepository, useValue: mockReservationRepo },
                { provide: ConcertService, useValue: mockConcertService },
            ],
        }).compile();

        service = module.get<ReservationService>(ReservationService);
        repository = module.get<ReservationRepository>(ReservationRepository);
        concertService = module.get<ConcertService>(ConcertService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('reserveSeat', () => {
        it('should conditionally create a reservation', async () => {
            mockReservationRepo.findByUserIdAndConcertId.mockResolvedValue(undefined);
            mockConcertService.reserveSeat.mockResolvedValue(undefined);
            mockReservationRepo.create.mockImplementation((dto) => Promise.resolve({ ...dto, id: 'res-1' }));

            const result = await service.reserveSeat('user-1', 'concert-1');
            expect(result.id).toEqual('res-1');
            expect(result.status).toEqual('RESERVED');
            expect(mockConcertService.reserveSeat).toHaveBeenCalledWith('concert-1');
            expect(mockReservationRepo.create).toHaveBeenCalled();
        });

        it('should throw BadRequestException if user already reserved a seat', async () => {
            mockReservationRepo.findByUserIdAndConcertId.mockResolvedValue({ id: 'res-1' });

            await expect(service.reserveSeat('user-1', 'concert-1')).rejects.toThrow(BadRequestException);
            expect(mockConcertService.reserveSeat).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException if concertService fails to reserve seat', async () => {
            mockReservationRepo.findByUserIdAndConcertId.mockResolvedValue(undefined);
            mockConcertService.reserveSeat.mockRejectedValue(new Error('No available seats'));

            await expect(service.reserveSeat('user-1', 'concert-1')).rejects.toThrow(BadRequestException);
            expect(mockReservationRepo.create).not.toHaveBeenCalled();
        });
    });

    describe('cancelReservation', () => {
        it('should cancel reservation successfully', async () => {
            const reservation = { id: 'res-1', userId: 'user-1', concertId: 'concert-1', status: 'RESERVED' };
            mockReservationRepo.findById.mockResolvedValue(reservation);
            mockConcertService.cancelSeat.mockResolvedValue(undefined);
            mockReservationRepo.updateStatus.mockResolvedValue({ ...reservation, status: 'CANCELLED' });

            await expect(service.cancelReservation('res-1', 'user-1')).resolves.toBeUndefined();
            expect(mockConcertService.cancelSeat).toHaveBeenCalledWith('concert-1');
            expect(mockReservationRepo.updateStatus).toHaveBeenCalledWith('res-1', 'CANCELLED');
        });

        it('should throw NotFoundException if reservation not found or already cancelled', async () => {
            mockReservationRepo.findById.mockResolvedValue(undefined);
            await expect(service.cancelReservation('res-1')).rejects.toThrow(NotFoundException);

            mockReservationRepo.findById.mockResolvedValue({ id: 'res-1', status: 'CANCELLED' });
            await expect(service.cancelReservation('res-1')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if another user tries to cancel', async () => {
            const reservation = { id: 'res-1', userId: 'user-1', concertId: 'concert-1', status: 'RESERVED' };
            mockReservationRepo.findById.mockResolvedValue(reservation);

            await expect(service.cancelReservation('res-1', 'user-2')).rejects.toThrow(BadRequestException);
            expect(mockConcertService.cancelSeat).not.toHaveBeenCalled();
        });
    });

    describe('getUserReservations', () => {
        it('should return user reservations', async () => {
            const reservations = [{ id: 'res-1', userId: 'user-1', concertId: 'concert-1', status: 'RESERVED' }];
            mockReservationRepo.findByUserId.mockResolvedValue(reservations);

            const result = await service.getUserReservations('user-1');
            expect(result).toEqual(reservations);
            expect(mockReservationRepo.findByUserId).toHaveBeenCalledWith('user-1');
        });

        it('should throw BadRequestException if userId is empty', async () => {
            await expect(service.getUserReservations('')).rejects.toThrow(BadRequestException);
        });
    });
});
