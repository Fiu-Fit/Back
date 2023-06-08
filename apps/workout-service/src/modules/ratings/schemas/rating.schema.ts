import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' })
  workoutId: string;

  @Prop({ required: true })
  athleteId: number;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment?: string;

  @Prop({ default: Date.now })
  ratedAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating)
  .index({ comment: 'text' })
  .index({ athleteId: 1 })
  .index({ rating: 1 });
