import { HttpModule } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { RatingService } from '../../ratings/rating.service';
import { Rating } from '../../ratings/schemas/rating.schema';
import { Workout } from '../schemas/workout.schema';
import { WorkoutService } from '../workouts.service';

describe('WorkoutService', () => {
  let workoutModel: Model<Workout>;
  let workoutService: WorkoutService;
  let ratingService: RatingService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutService,
        {
          provide:  getModelToken(Workout.name),
          useValue: Model
        },
        RatingService,
        {
          provide:  getModelToken(Rating.name),
          useValue: Model
        }
      ],
      imports: [HttpModule]
    }).compile();

    workoutService = await module.resolve(WorkoutService);
    workoutModel = await module.resolve(getModelToken(Workout.name));
    ratingService = await module.resolve(RatingService);
  });

  it('should be defined', () => {
    expect(workoutService).toBeDefined();
    expect(workoutModel).toBeDefined();
  });

  const defaultWorkout: Workout = {
    id:          '123456789101',
    name:        'Abdominales',
    description: 'Abdominales',
    duration:    30,
    difficulty:  5,
    category:    4,
    exercises:   [],
    athleteIds:  [],
    authorId:    1,
    isBlocked:   false,
    multimedia:  []
  };

  describe('create', () => {
    it('should create a workout', async () => {
      jest
        .spyOn(workoutModel, 'create')
        .mockImplementation(() => Promise.resolve(defaultWorkout as any));

      const result = await workoutService.createWorkout(defaultWorkout);

      expect(result).toBe(defaultWorkout);
      expect(workoutModel.create).toHaveBeenCalledWith(defaultWorkout);
    });
  });

  describe('find', () => {
    it('should find all workouts', async () => {
      const workouts = [
        defaultWorkout,
        {
          ...defaultWorkout,
          id: '123456789102'
        }
      ];

      jest.spyOn(workoutModel, 'find').mockResolvedValue(workouts);

      const result = await workoutService.getWorkouts();

      expect(result).toStrictEqual(workouts);
      expect(workoutModel.find).toHaveBeenCalledWith({});
    });

    it('Empty array doesnt throw error', async () => {
      jest.spyOn(workoutModel, 'find').mockResolvedValue([]);

      const result = await workoutService.getWorkouts();

      expect(result).toStrictEqual([]);
      expect(workoutModel.find).toHaveBeenCalledWith({});
    });
  });

  describe('findById', () => {
    it('Should return workout with ID', async () => {
      const id = '123456789101';

      const mockAggregateResult = {
        ...defaultWorkout,
        exercises: []
      };

      jest
        .spyOn(workoutModel, 'aggregate')
        .mockResolvedValueOnce([mockAggregateResult]);

      jest.spyOn(ratingService, 'getAverageRating').mockResolvedValueOnce(4.5);

      const result = await workoutService.getWorkoutById(id);

      expect(result).toEqual({
        ...mockAggregateResult,
        averageRating: 4.5
      });
    });

    it('should throw error if not found', async () => {
      const id = '123456789101';

      jest.spyOn(workoutModel, 'aggregate').mockResolvedValueOnce([null]);

      await expect(workoutService.getWorkoutById(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateById', () => {
    it('Should update workout', async () => {
      const { description, ...rest } = defaultWorkout;
      const updatedWorkout: Workout = {
        ...rest,
        description: 'Abdominales modificados'
      };
      const id = '123456789101';

      jest
        .spyOn(workoutModel, 'findByIdAndUpdate')
        .mockResolvedValue(updatedWorkout as any);

      const result = await workoutService.updateWorkout(id, updatedWorkout);

      expect(result).toStrictEqual(updatedWorkout);
      expect(workoutModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: id },
        { $set: updatedWorkout },
        { new: true }
      );
    });

    it('should throw error if not found', async () => {
      const id = '123456789101';
      jest.spyOn(workoutModel, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(
        workoutService.updateWorkout(id, defaultWorkout)
      ).rejects.toThrow(NotFoundException);
      expect(workoutModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: id },
        { $set: defaultWorkout },
        { new: true }
      );
    });
  });

  describe('deleteById', () => {
    it('Should delete workout', async () => {
      const id = '123456789101';

      jest
        .spyOn(workoutModel, 'findByIdAndDelete')
        .mockResolvedValue(defaultWorkout);

      const result = await workoutService.deleteWorkout(id);

      expect(result).toStrictEqual(defaultWorkout);
      expect(workoutModel.findByIdAndDelete).toHaveBeenCalledWith({
        _id: id
      });
    });

    it('should throw error if not found', async () => {
      const id = '123456789101';

      jest.spyOn(workoutModel, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(workoutService.deleteWorkout(id)).rejects.toThrow(
        NotFoundException
      );
      expect(workoutModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: id });
    });
  });
});
