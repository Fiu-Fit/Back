import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from '../../workout/interfaces/workout.interface';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
  @Prop({ type: String, name: '_id' })
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  category: Category;

  @Prop()
  METValue: number;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise)
  .index({
    name:        'text',
    description: 'text'
  })
  .index({ category: 1 });
