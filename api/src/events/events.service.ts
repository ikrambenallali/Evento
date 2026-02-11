import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) { }

  async create(dto: any, userId: string) {
    if (!userId) {
      console.error('userId est undefined ou null');
      throw new BadRequestException('User ID is required but was not provided');
    }
    const event = new this.eventModel({
      ...dto,
      createdBy: userId,
    });

    return event.save();
  }

  async findAll() {
    return this.eventModel.find().exec();
  }

  async eventDetails(id: string) {
    return this.eventModel.findById(id).exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event id');
    }

    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async remove(id: string) {
    return this.eventModel.findByIdAndDelete(id).exec();
  }
  
  async update(id: string, dto: any) {
    return this.eventModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async updateStatus(id: string, status: string) {
    return this.eventModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async getAllEventsPublished() {
    return this.eventModel.find({ status: 'PUBLISHED' }).exec();
  }
}