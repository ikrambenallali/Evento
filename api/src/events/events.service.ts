import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

 async create(dto: any, userId: string) {
    // ✅ Validation explicite du userId
    if (!userId) {
      console.error('❌ userId est undefined ou null');
      throw new BadRequestException('User ID is required but was not provided');
    }

    console.log('✅ Creating event with userId:', userId);

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
}
