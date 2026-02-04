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
}
