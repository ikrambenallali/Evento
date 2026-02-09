import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';

/* =========================
   MOCK MONGOOSE MODEL
========================= */

const saveMock = jest.fn();

const mockEventModel: any = jest.fn().mockImplementation(() => ({
  save: saveMock,
}));

mockEventModel.find = jest.fn();
mockEventModel.findById = jest.fn();
mockEventModel.findByIdAndDelete = jest.fn();
mockEventModel.findByIdAndUpdate = jest.fn();

/* =========================
   TESTS
========================= */

describe('EventsService', () => {
  let service: EventsService;
  let model: Model<Event>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  /* ---------- create ---------- */
  describe('create', () => {
    it('should throw BadRequestException if userId is missing', async () => {
      await expect(service.create({}, null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and save an event', async () => {
      const dto = { title: 'Test Event' };
      const userId = new Types.ObjectId().toString();

      saveMock.mockResolvedValue({
        ...dto,
        createdBy: userId,
      });

      const result = await service.create(dto, userId);

      expect(saveMock).toHaveBeenCalled();
      expect(result.createdBy).toBe(userId);
    });
  });

  /* ---------- findAll ---------- */
  describe('findAll', () => {
    it('should return all events', async () => {
      const events = [{ title: 'Event 1' }];

      mockEventModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(events),
      });

      const result = await service.findAll();
      expect(result).toEqual(events);
    });
  });

  /* ---------- findById ---------- */
  describe('findById', () => {
    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findById('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if event not found', async () => {
      const id = new Types.ObjectId().toString();

      mockEventModel.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });

    it('should return event if found', async () => {
      const id = new Types.ObjectId().toString();
      const event = { _id: id, title: 'Event Test' };

      mockEventModel.findById.mockResolvedValue(event);

      const result = await service.findById(id);
      expect(result).toEqual(event);
    });
  });

  /* ---------- remove ---------- */
  describe('remove', () => {
    it('should delete event by id', async () => {
      const id = new Types.ObjectId().toString();

      mockEventModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      const result = await service.remove(id);
      expect(result).toBe(true);
    });
  });

  /* ---------- update ---------- */
  describe('update', () => {
    it('should update event', async () => {
      const id = new Types.ObjectId().toString();
      const dto = { title: 'Updated' };

      mockEventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(dto),
      });

      const result = await service.update(id, dto);
      expect(result.title).toBe('Updated');
    });
  });

  /* ---------- updateStatus ---------- */
  describe('updateStatus', () => {
    it('should update event status', async () => {
      const id = new Types.ObjectId().toString();

      mockEventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ status: 'PUBLISHED' }),
      });

      const result = await service.updateStatus(id, 'PUBLISHED');
      expect(result.status).toBe('PUBLISHED');
    });
  });

  /* ---------- getAllEventsPublished ---------- */
  describe('getAllEventsPublished', () => {
    it('should return published events', async () => {
      const events = [{ status: 'PUBLISHED' }];

      mockEventModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(events),
      });

      const result = await service.getAllEventsPublished();
      expect(result).toEqual(events);
    });
  });
});
