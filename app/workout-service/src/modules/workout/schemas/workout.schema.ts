import { Category, Unit } from '@fiu-fit/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WorkoutDocument = HydratedDocument<Workout>;

@Schema()
export class WorkoutExercise {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' })
  exerciseId: string;

  @Prop()
  sets: number;

  @Prop()
  reps: number;

  @Prop()
  weight?: number;

  @Prop()
  unit: Unit;

  @Prop()
  repDuration: number; // seconds spent per rep
}

@Schema()
export class Workout {
  @Prop({ type: String, name: '_id' })
  id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true, min: 1, max: 5 })
  difficulty: number;

  @Prop({ required: true })
  category: Category;

  @Prop([WorkoutExercise])
  exercises: WorkoutExercise[];

  @Prop([Number])
  athleteIds: number[];

  @Prop({ required: true })
  authorId: number;

  @Prop()
  averageRating?: number;

  @Prop()
  updatedAt?: Date;

  @Prop()
  multimedia: string[];

  @Prop({ default: false })
  isBlocked: boolean;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout)
  .index({ name: 'text', description: 'text' })
  .index({ category: 1 })
  .index({ difficulty: 1 });
