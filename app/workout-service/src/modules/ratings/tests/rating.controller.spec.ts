import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { RatingController } from '../rating.controller';
import { RatingService } from '../rating.service';
import { Rating } from '../schemas/rating.schema';

describe('RatingController', () => {
  let ratingController: RatingController;
  let ratingService: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers:   [
        RatingService,
        {
          provide:  getModelToken(Rating.name),
          useValue: Model
        }
      ]
    }).compile();

    ratingService = await module.resolve(RatingService);
    ratingController = await module.resolve(RatingController);
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
    const rating1 = new Rating();
    rating1.workoutId = '1';
    rating1.athleteId = 1;
    rating1.rating = 4;

    const rating2 = new Rating();
    rating2.workoutId = '2';
    rating2.athleteId = 2;
    rating2.rating = 3;

    const ratings = [rating1, rating2];
    it('should get all ratings', async () => {
      const filters = {
        workoutId: '1',
        athleteId: 1,
        rating:    [3, 5]
      };
      jest
        .spyOn(ratingService, 'getRatings')
        .mockResolvedValue(ratings as Rating[]);

      const result = await ratingController.getRatings(JSON.stringify(filters));

      expect(result).toBe(ratings);
      expect(ratingService.getRatings).toHaveBeenCalledWith(filters);
    });

    it('should get all ratings without filters', async () => {
      jest
        .spyOn(ratingService, 'getRatings')
        .mockResolvedValue(ratings as Rating[]);

      const result = await ratingController.getRatings('{}');

      expect(result).toBe(ratings);
      expect(ratingService.getRatings).toHaveBeenCalledWith({});
    });
  });

  describe('getRatingById', () => {
    it('should get a rating by ID', async () => {
      const ratingId = '1';

      const rating = new Rating();
      rating.workoutId = '1';
      rating.athleteId = 1;
      rating.rating = 4;

      jest
        .spyOn(ratingService, 'getRatingById')
        .mockResolvedValue(rating as Rating);

      const result = await ratingController.getRatingById(ratingId);

      expect(result).toBe(rating);
      expect(ratingService.getRatingById).toHaveBeenCalledWith(ratingId);
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating by ID', async () => {
      const ratingId = '1';

      const rating = new Rating();
      rating.workoutId = '1';
      rating.athleteId = 1;
      rating.rating = 4;

      jest
        .spyOn(ratingService, 'deleteRating')
        .mockResolvedValue(rating as Rating);

      const result = await ratingController.deleteRating(ratingId);

      expect(result).toBe(rating);
      expect(ratingService.deleteRating).toHaveBeenCalledWith(ratingId);
    });
  });

  describe('updateRating', () => {
    it('should update a rating by ID', async () => {
      const ratingId = '1';

      const updatedRatingData = new Rating();
      updatedRatingData.workoutId = '1';
      updatedRatingData.athleteId = 1;
      updatedRatingData.rating = 4;

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
  });
});
