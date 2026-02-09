import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { ReservationsService } from './reservations.service';
import { Reservation } from './schemas/reservation.schema';
import { ReservationStatus } from './enums/reservation-status.enum';
import { EventsService } from '../events/events.service';

/* =========================
   MOCKS
========================= */

const saveMock = jest.fn();

const mockReservationModel: any = {
  findOne: jest.fn(),
  countDocuments: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
};

const mockEventsService = {
  findById: jest.fn(),
};

/* =========================
   TESTS
========================= */

describe('ReservationsService', () => {
  let service: ReservationsService;
  let model: Model<Reservation>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(Reservation.name),
          useValue: mockReservationModel,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    model = module.get<Model<Reservation>>(getModelToken(Reservation.name));
  });

  /* =========================
     createReservation
  ========================= */

  describe('createReservation', () => {
    const userId = new Types.ObjectId().toString();
    const eventId = new Types.ObjectId().toString();

    it('should throw NotFoundException if event not found', async () => {
      mockEventsService.findById.mockResolvedValue(null);

      await expect(
        service.createReservation(userId, { eventId } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if event not published', async () => {
      mockEventsService.findById.mockResolvedValue({
        status: 'DRAFT',
      });

      await expect(
        service.createReservation(userId, { eventId } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reservation already exists', async () => {
      mockEventsService.findById.mockResolvedValue({
        status: 'PUBLISHED',
        capacity: 10,
      });

      mockReservationModel.findOne.mockResolvedValue({});

      await expect(
        service.createReservation(userId, { eventId } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if event is full', async () => {
      mockEventsService.findById.mockResolvedValue({
        status: 'PUBLISHED',
        capacity: 1,
      });

      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.countDocuments.mockResolvedValue(1);

      await expect(
        service.createReservation(userId, { eventId } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create reservation successfully', async () => {
      const reservation = { status: ReservationStatus.PENDING };

      mockEventsService.findById.mockResolvedValue({
        status: 'PUBLISHED',
        capacity: 10,
      });

      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.countDocuments.mockResolvedValue(0);
      mockReservationModel.create.mockResolvedValue(reservation);

      const result = await service.createReservation(userId, { eventId } as any);

      expect(result).toEqual(reservation);
      expect(mockReservationModel.create).toHaveBeenCalled();
    });
  });

  /* =========================
     updateStatus
  ========================= */

  describe('updateStatus', () => {
    const reservationId = new Types.ObjectId().toString();

    it('should throw NotFoundException if reservation not found', async () => {
      mockReservationModel.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus(reservationId, ReservationStatus.CONFIRMED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if reservation already processed', async () => {
      mockReservationModel.findById.mockResolvedValue({
        status: ReservationStatus.CONFIRMED,
      });

      await expect(
        service.updateStatus(reservationId, ReservationStatus.CONFIRMED),
      ).rejects.toThrow(BadRequestException);
    });

    it('should confirm reservation successfully', async () => {
      const reservation: any = {
        status: ReservationStatus.PENDING,
        event: new Types.ObjectId(),
        save: saveMock,
      };

      mockReservationModel.findById.mockResolvedValue(reservation);
      mockReservationModel.countDocuments.mockResolvedValue(0);
      mockEventsService.findById.mockResolvedValue({ capacity: 10 });

      saveMock.mockResolvedValue({ status: ReservationStatus.CONFIRMED });

      const result = await service.updateStatus(
        reservationId,
        ReservationStatus.CONFIRMED,
      );

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  /* =========================
     cancelReservation
  ========================= */

  describe('cancelReservation', () => {
    const reservationId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    it('should throw NotFoundException if reservation not found', async () => {
      mockReservationModel.findById.mockResolvedValue(null);

      await expect(
        service.cancelReservation(reservationId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockReservationModel.findById.mockResolvedValue({
        user: new Types.ObjectId(),
      });

      await expect(
        service.cancelReservation(reservationId, userId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should cancel reservation successfully', async () => {
      const reservation: any = {
        user: new Types.ObjectId(userId),
        status: ReservationStatus.PENDING,
        save: saveMock,
      };

      saveMock.mockResolvedValue({
        status: ReservationStatus.CANCELED,
      });

      mockReservationModel.findById.mockResolvedValue(reservation);

      const result = await service.cancelReservation(reservationId, userId);

      expect(result.status).toBe(ReservationStatus.CANCELED);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  /* =========================
     findMyReservations
  ========================= */

  describe('findMyReservations', () => {
    it('should return user reservations', async () => {
      const chain = {
        populate: jest.fn().mockReturnThis(),
      };

      mockReservationModel.find.mockReturnValue(chain);

      const result = await service.findMyReservations('user-id');

      expect(result).toBe(chain);
      expect(chain.populate).toHaveBeenCalledWith('event');
    });
  });

  /* =========================
     findAll
  ========================= */

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const chain = {
        populate: jest.fn().mockReturnThis(),
      };

      mockReservationModel.find.mockReturnValue(chain);

      const result = await service.findAll();

      expect(result).toBe(chain);
      expect(chain.populate).toHaveBeenCalled();
    });
  });
});
