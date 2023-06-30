import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { PrismaService } from '../../../prisma.service';
import { UserLocation } from '../../user-location/schema/user-location.schema';
import { UserLocationModule } from '../../user-location/user-location.module';
import { UserService } from '../user.service';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;
  let exerciseModel: Model<UserLocation>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:   [HttpModule, UserLocationModule],
      providers: [UserService, PrismaService]
    }).compile();

    userService = await module.resolve(UserService);

    prisma = module.get<PrismaService>(PrismaService);

    exerciseModel = await module.resolve(getModelToken(UserLocation.name));
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(userService).toBeDefined();
    expect(exerciseModel).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create a exercise', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     jest
  //       .spyOn(exerciseModel, 'create')
  //       .mockImplementation(() => Promise.resolve(exercise as any));
  //
  //     const result = await exerciseService.createExercise(exercise);
  //
  //     expect(result).toBe(exercise);
  //     expect(exerciseModel.create).toHaveBeenCalledWith(exercise);
  //   });
  // });
  //
  // describe('find', () => {
  //   it('should find all exercises', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     jest.spyOn(exerciseModel, 'find').mockResolvedValue([exercise as any]);
  //
  //     const result = await exerciseService.getExercises();
  //
  //     expect(result).toStrictEqual([exercise]);
  //     expect(exerciseModel.find).toHaveBeenCalledWith({});
  //   });
  //
  //   it('Empty array doesnt throw error', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     jest.spyOn(exerciseModel, 'find').mockResolvedValue([] as any);
  //
  //     const result = await exerciseService.getExercises();
  //
  //     expect(result).toStrictEqual([]);
  //     expect(exerciseModel.find).toHaveBeenCalledWith({});
  //   });
  // });
  //
  // describe('findById', () => {
  //   it('Should return exercise with ID', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     const id = '123';
  //
  //     jest.spyOn(exerciseModel, 'findById').mockResolvedValue(exercise);
  //
  //     const result = await exerciseService.getExercise(id);
  //
  //     expect(result).toStrictEqual(exercise);
  //     expect(exerciseModel.findById).toHaveBeenCalledWith({ _id: id });
  //   });
  //
  //   it('should throw error if not found', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     const id = '123';
  //
  //     jest.spyOn(exerciseModel, 'findById').mockResolvedValue(null);
  //
  //     await expect(exerciseService.getExercise(id)).rejects.toThrow(
  //       NotFoundException
  //     );
  //     expect(exerciseModel.findById).toHaveBeenCalledWith({ _id: id });
  //   });
  // });
  //
  // describe('updateById', () => {
  //   it('Should update exercise', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     const id = '123';
  //
  //     jest
  //       .spyOn(exerciseModel, 'findByIdAndUpdate')
  //       .mockResolvedValue(exercise);
  //
  //     const result = await exerciseService.updateExercise(id, exercise);
  //
  //     expect(result).toStrictEqual(exercise);
  //     expect(exerciseModel.findByIdAndUpdate).toHaveBeenCalledWith(
  //       { _id: id },
  //       exercise,
  //       { new: true }
  //     );
  //   });
  //
  //   it('should throw error if not found', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     const id = '123';
  //
  //     jest.spyOn(exerciseModel, 'findByIdAndUpdate').mockResolvedValue(null);
  //
  //     await expect(
  //       exerciseService.updateExercise(id, exercise)
  //     ).rejects.toThrow(NotFoundException);
  //     expect(exerciseModel.findByIdAndUpdate).toHaveBeenCalledWith(
  //       { _id: id },
  //       exercise,
  //       { new: true }
  //     );
  //   });
  // });
  //
  // describe('deleteById', () => {
  //   it('Should delete exercise', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     const id = '123';
  //
  //     jest
  //       .spyOn(exerciseModel, 'findByIdAndDelete')
  //       .mockResolvedValue(exercise);
  //
  //     const result = await exerciseService.deleteExercise(id);
  //
  //     expect(result).toStrictEqual(exercise);
  //     expect(exerciseModel.findByIdAndDelete).toHaveBeenCalledWith({
  //       _id: id
  //     });
  //   });
  //
  //   it('should throw error if not found', async () => {
  //     const exercise = new Exercise();
  //     exercise.name = 'Abdominales';
  //     exercise.description = 'Abdominales';
  //     exercise.category = Category.CORE;
  //     exercise.METValue = 1.5;
  //
  //     const id = '123';
  //
  //     jest.spyOn(exerciseModel, 'findByIdAndDelete').mockResolvedValue(null);
  //
  //     await expect(exerciseService.deleteExercise(id)).rejects.toThrow(
  //       NotFoundException
  //     );
  //     expect(exerciseModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: id });
  //   });
  // });
});
