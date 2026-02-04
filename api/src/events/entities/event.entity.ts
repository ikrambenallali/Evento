    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
    import { Document, Types } from 'mongoose';
    import { EventStatus } from '../enums/event-status.enum';

    export type EventDocument = Event & Document;

    @Schema({ timestamps: true })
    export class Event {
        @Prop({ required: true })
        title: string;

        @Prop({ required: true })
        description: string;

        @Prop({ required: true })
        date: Date;

        @Prop({ required: true })
        location: string;

        @Prop({ required: false })
        photoUrl: string;

        @Prop({
            type: String,
            enum: EventStatus,
            default: EventStatus.DRAFT,
        })
        status: EventStatus;

        @Prop({ required: true, min: 1 })
        capacity: number;

    
        @Prop({ type: Types.ObjectId, ref: 'User', required: true })
        createdBy: Types.ObjectId;
    }

    export const EventSchema = SchemaFactory.createForClass(Event);
