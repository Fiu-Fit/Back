import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<UserLocation>;

@Schema()
export class UserLocation {
  @Prop({ type: String, name: '_id' })
  id: string;

  @Prop({ required: true, unique: true })
  userId: number;

  @Prop({
    type:        { type: String, default: 'Point', required: true },
    coordinates: { type: [Number], required: true }
  }) // Default type is 'Point' for geolocation
  location: { type: string; coordinates: number[] };

  @Prop()
  updatedAt?: Date;
}

export const UserLocationsSchema = SchemaFactory.createForClass(UserLocation)
  .index({ userId: 1 })
  .index({ location: '2dsphere' });
