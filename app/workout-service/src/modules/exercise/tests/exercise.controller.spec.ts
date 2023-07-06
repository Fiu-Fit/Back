import { Category } from '@fiu-fit/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ExerciseController } from '../exercise.controller';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../schemas/exercise.schema';

describe('ExerciseController', () => {
  let exerciseService: ExerciseService;
  let exerciseController: ExerciseController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseController],
      providers:   [
        ExerciseService,
        {
          provide:  getModelToken(Exercise.name),
          useValue: Model
        }
      ]
    }).compile();
    // Make sure to use the correct Document Type for the 'module.get' func
    // exerciseService = module.get<ExerciseService>(ExerciseService);

    exerciseService = await module.resolve(ExerciseService);
    exerciseController = await module.resolve(ExerciseController);
  });

  it('should be defined', () => {
    expect(exerciseService).toBeDefined();
    expect(exerciseController).toBeDefined();
  });

  describe('create', () => {
    it('should create a exercise', async () => {
      const exercise = new Exercise();
      exercise.name = 'Abdominales';
      exercise.description = 'Abdominales';
      exercise.category = Category.CORE;
      exercise.METValue = 1.5;

      jest
        .spyOn(exerciseService, 'createExercise')
        .mockImplementation(() => Promise.resolve(exercise as any));

      const result = await exerciseController.createExercise(exercise);

      expect(result).toBe(exercise);
      expect(exerciseService.createExercise).toHaveBeenCalledWith(exercise);
    });
  });

  describe('find', () => {
    it('should find all exercises', async () => {
      const exercise = new Exercise();
      exercise.name = 'Abdominales';
      exercise.description = 'Abdominales';
      exercise.category = Category.CORE;
      exercise.METValue = 1.5;

      jest
        .spyOn(exerciseService, 'getExercises')
        .mockResolvedValue([exercise as any]);

      const result = await exerciseController.getExercises();

      expect(result).toStrictEqual([exercise]);
      expect(exerciseService.getExercises).toHaveBeenCalledWith(undefined, {});
    });

    it('Empty array doesnt throw error', async () => {
      const exercise = new Exercise();
      exercise.name = 'Abdominales';
      exercise.description = 'Abdominales';
      exercise.category = Category.CORE;
      exercise.METValue = 1.5;

      jest.spyOn(exerciseService, 'getExercises').mockResolvedValue([] as any);

      const result = await exerciseController.getExercises();

      expect(result).toStrictEqual([]);
      expect(exerciseService.getExercises).toHaveBeenCalledWith(undefined, {});
    });
  });

  describe('findById', () => {
    it('Should return exercise with ID', async () => {
      const exercise = new Exercise();
      exercise.name = 'Abdominales';
      exercise.description = 'Abdominales';
      exercise.category = Category.CORE;
      exercise.METValue = 1.5;

      const id = '123';

      jest.spyOn(exerciseService, 'getExercise').mockResolvedValue(exercise);

      const result = await exerciseController.getExercise(id);

      expect(result).toStrictEqual(exercise);
      expect(exerciseService.getExercise).toHaveBeenCalledWith(id);
    });
  });

  describe('updateById', () => {
    it('Should update exercise', async () => {
      const exercise = new Exercise();
      exercise.name = 'Abdominales';
      exercise.description = 'Abdominales';
      exercise.category = Category.CORE;
      exercise.METValue = 1.5;

      const id = '123';

      jest.spyOn(exerciseService, 'updateExercise').mockResolvedValue(exercise);

      const result = await exerciseController.updateExercise(id, exercise);

      expect(result).toStrictEqual(exercise);
      expect(exerciseService.updateExercise).toHaveBeenCalledWith(id, exercise);
    });
  });

  describe('deleteById', () => {
    it('Should delete exercise', async () => {
      const exercise = new Exercise();
      exercise.name = 'Abdominales';
      exercise.description = 'Abdominales';
      exercise.category = Category.CORE;
      exercise.METValue = 1.5;

      const id = '123';

      jest.spyOn(exerciseService, 'deleteExercise').mockResolvedValue(exercise);

      const result = await exerciseController.deleteExercise(id);

      expect(result).toStrictEqual(exercise);
      expect(exerciseService.deleteExercise).toHaveBeenCalledWith(id);
    });
  });
});
