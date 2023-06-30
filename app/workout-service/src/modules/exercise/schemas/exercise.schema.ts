import { Category } from '@fiu-fit/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop()
  image: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise)
  .index({
    name:        'text',
    description: 'text'
  })
  .index({ category: 1 });
