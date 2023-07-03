import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { RatingController } from '../rating.controller';
import { RatingService } from '../rating.service';
import { Rating, RatingDocument } from '../schemas/rating.schema';

describe('RatingController', () => {
  let ratingController: RatingController;
  let ratingService: RatingService;

  const mockRatingModel: Model<RatingDocument> = jest.fn(() => ({
    create:            jest.fn(),
    find:              jest.fn(),
    findById:          jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    aggregate:         jest.fn()
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers:   [
        RatingService,
        {
          provide:  Model,
          useValue: mockRatingModel
        }
      ]
    }).compile();

    ratingController = module.get<RatingController>(RatingController);
    ratingService = module.get<RatingService>(RatingService);
  });

  describe('createRating', () => {
    it('should create a rating', async () => {
      const newRating = {
        workoutId: 'workout1',
        athleteId: 1,
        rating:    4,
        comment:   'Great workout',
        ratedAt:   new Date()
      };

      const createdRating = {
        _id: '1',
        ...newRating
      };

      jest
        .spyOn(ratingService, 'createRating')
        .mockResolvedValue(createdRating as Rating);

      const result = await ratingController.createRating(newRating);

      expect(result).toBe(createdRating);
      expect(ratingService.createRating).toHaveBeenCalledWith(newRating);
    });
  });

  describe('getRatings', () => {
    it('should get all ratings', async () => {
      const filters = {
        workoutId: 'workout1',
        athleteId: 1,
        rating:    [3, 5]
      };

      const ratings = [
        {
          _id:       '1',
          workoutId: 'workout1',
          athleteId: 1,
          rating:    4,
          comment:   'Great workout',
          ratedAt:   new Date()
        },
        {
          _id:       '2',
          workoutId: 'workout2',
          athleteId: 2,
          rating:    3,
          comment:   'Good workout',
          ratedAt:   new Date()
        }
      ];

      jest
        .spyOn(ratingService, 'getRatings')
        .mockResolvedValue(ratings as Rating[]);

      const result = await ratingController.getRatings(filters);

      expect(result).toBe(ratings);
      expect(ratingService.getRatings).toHaveBeenCalledWith(filters);
    });

    it('should get all ratings without filters', async () => {
      const ratings = [
        {
          _id:       '1',
          workoutId: 'workout1',
          athleteId: 1,
          rating:    4,
          comment:   'Great workout',
          ratedAt:   new Date()
        },
        {
          _id:       '2',
          workoutId: 'workout2',
          athleteId: 2,
          rating:    3,
          comment:   'Good workout',
          ratedAt:   new Date()
        }
      ];

      jest
        .spyOn(ratingService, 'getRatings')
        .mockResolvedValue(ratings as Rating[]);

      const result = await ratingController.getRatings();

      expect(result).toBe(ratings);
      expect(ratingService.getRatings).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getRatingById', () => {
    it('should get a rating by ID', async () => {
      const ratingId = '1';
      const rating = {
        _id:       ratingId,
        workoutId: 'workout1',
        athleteId: 1,
        rating:    4,
        comment:   'Great workout',
        ratedAt:   new Date()
      };

      jest
        .spyOn(ratingService, 'getRatingById')
        .mockResolvedValue(rating as Rating);

      const result = await ratingController.getRatingById(ratingId);

      expect(result).toBe(rating);
      expect(ratingService.getRatingById).toHaveBeenCalledWith(ratingId);
    });

    it('should throw BadRequestException if rating is not found', async () => {
      const ratingId = '1';

      jest.spyOn(ratingService, 'getRatingById').mockResolvedValue(null);

      await expect(ratingController.getRatingById(ratingId)).rejects.toThrow(
        BadRequestException
      );
      expect(ratingService.getRatingById).toHaveBeenCalledWith(ratingId);
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating by ID', async () => {
      const ratingId = '1';
      const rating = {
        _id:       ratingId,
        workoutId: 'workout1',
        athleteId: 1,
        rating:    4,
        comment:   'Great workout',
        ratedAt:   new Date()
      };

      jest
        .spyOn(ratingService, 'deleteRating')
        .mockResolvedValue(rating as Rating);

      const result = await ratingController.deleteRating(ratingId);

      expect(result).toBe(rating);
      expect(ratingService.deleteRating).toHaveBeenCalledWith(ratingId);
    });

    it('should throw NotFoundException if rating is not found', async () => {
      const ratingId = '1';

      jest.spyOn(ratingService, 'deleteRating').mockResolvedValue(null);

      await expect(ratingController.deleteRating(ratingId)).rejects.toThrow(
        NotFoundException
      );
      expect(ratingService.deleteRating).toHaveBeenCalledWith(ratingId);
    });
  });

  describe('updateRating', () => {
    it('should update a rating by ID', async () => {
      const ratingId = '1';
      const updatedRatingData = {
        workoutId: 'workout1',
        athleteId: 1,
        rating:    5,
        comment:   'Excellent workout'
      };

      const updatedRating = {
        _id: ratingId,
        ...updatedRatingData
      };

      jest
        .spyOn(ratingService, 'updateRating')
        .mockResolvedValue(updatedRating as Rating);

      const result = await ratingController.updateRating(
        ratingId,
        updatedRatingData
      );

      expect(result).toBe(updatedRating);
      expect(ratingService.updateRating).toHaveBeenCalledWith(
        ratingId,
        updatedRatingData
      );
    });

    it('should throw NotFoundException if rating is not found', async () => {
      const ratingId = '1';
      const updatedRatingData = {
        workoutId: 'workout1',
        athleteId: 1,
        rating:    5,
        comment:   'Excellent workout'
      };

      jest.spyOn(ratingService, 'updateRating').mockResolvedValue(null);

      await expect(
        ratingController.updateRating(ratingId, updatedRatingData)
      ).rejects.toThrow(NotFoundException);
      expect(ratingService.updateRating).toHaveBeenCalledWith(
        ratingId,
        updatedRatingData
      );
    });
  });

  describe('getAverageRating', () => {
    it('should get the average rating for a workout', async () => {
      const workoutId = 'workout1';
      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const averageRating = 4;

      jest
        .spyOn(ratingService, 'getAverageRating')
        .mockResolvedValue(averageRating);

      const result = await ratingController.getAverageRating(
        workoutId,
        start,
        end
      );

      expect(result).toBe(averageRating);
      expect(ratingService.getAverageRating).toHaveBeenCalledWith(
        workoutId,
        start,
        end
      );
    });
  });

  describe('getRatingCountPerValue', () => {
    it('should get the rating count per value for a workout', async () => {
      const workoutId = 'workout1';
      const start = new Date('2023-01-01');
      const end = new Date('2023-01-31');
      const ratingCounts = [
        { rating: 1, count: 3 },
        { rating: 2, count: 5 },
        { rating: 3, count: 10 },
        { rating: 4, count: 8 },
        { rating: 5, count: 12 }
      ];

      jest
        .spyOn(ratingService, 'getRatingCountPerValue')
        .mockResolvedValue(ratingCounts);

      const result = await ratingController.getRatingCountPerValue(
        workoutId,
        start,
        end
      );

      expect(result).toBe(ratingCounts);
      expect(ratingService.getRatingCountPerValue).toHaveBeenCalledWith(
        workoutId,
        start,
        end
      );
    });
  });
});
