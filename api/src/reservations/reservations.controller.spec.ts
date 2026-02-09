import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { EventsService } from '../events/events.service';
import { Reservation } from './schemas/reservation.schema';
import { ReservationStatus } from './enums/reservation-status.enum';

/* =========================
   MOCKS
========================= */

const mockReservationModel = {};
const mockReservationsService = {
  createReservation: jest.fn(),
  updateStatus: jest.fn(),
  cancelReservation: jest.fn(),
  findMyReservations: jest.fn(),
  findAll: jest.fn(),
};

const mockEventsService = {
  findById: jest.fn(),
};

/* =========================
   TESTS
========================= */

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
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

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
