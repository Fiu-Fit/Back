import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { RatingService } from '../rating.service';
import { Rating } from '../schemas/rating.schema';

describe('RatingService', () => {
  let ratingModel: Model<Rating>;
  let ratingService: RatingService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide:  getModelToken(Rating.name),
          useValue: Model
        }
      ]
    }).compile();
    // Make sure to use the correct Document Type for the 'module.get' func
    // exerciseService = module.get<ExerciseService>(ExerciseService);

    ratingService = await module.resolve(RatingService);
    ratingModel = await module.resolve(getModelToken(Rating.name));
  });

  it('should be defined', () => {
    expect(ratingService).toBeDefined();
    expect(ratingModel).toBeDefined();
  });

  describe('create', () => {
    it('should create a exercise', async () => {
      const rating = new Rating();
      rating.workoutId = '1';
      rating.athleteId = 1;
      rating.rating = 3;

      jest
        .spyOn(ratingModel, 'create')
        .mockImplementation(() => Promise.resolve(rating as any));

      const result = await ratingService.createRating(rating);

      expect(result).toBe(rating);
      expect(ratingModel.create).toHaveBeenCalledWith(rating);
    });
  });

  describe('getRatings', () => {
    it('should get ratings with filters', async () => {
      const filters: Record<
        string,
        string | number | [number, number] | { $gte: number; $lte: number }
      > = {
        workoutId: '1',
        rating:    [1, 3]
      };

      const rating1 = new Rating();
      rating1.workoutId = '1';
      rating1.athleteId = 1;
      rating1.rating = 3;

      const rating2 = new Rating();
      rating2.workoutId = '2';
      rating2.athleteId = 2;
      rating2.rating = 4;

      const expectedRatings: Rating[] = [rating1, rating2];

      jest.spyOn(ratingModel, 'find').mockResolvedValue(expectedRatings);

      const result = await ratingService.getRatings(filters);

      expect(result).toEqual(expectedRatings);
      expect(ratingModel.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('getRatingById', () => {
    it('should get a rating by ID', async () => {
      const ratingId = '1';

      const expectedRating = new Rating();
      expectedRating.workoutId = '1';
      expectedRating.athleteId = 2;
      expectedRating.rating = 4;

      jest.spyOn(ratingModel, 'findById').mockResolvedValue(expectedRating);

      const result = await ratingService.getRatingById(ratingId);

      expect(result).toEqual(expectedRating);
      expect(ratingModel.findById).toHaveBeenCalledWith({ _id: ratingId });
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating by ID', async () => {
      const ratingId = '1';

      const deletedRating = new Rating();
      deletedRating.workoutId = '1';
      deletedRating.athleteId = 1;
      deletedRating.rating = 4;

      jest
        .spyOn(ratingModel, 'findByIdAndDelete')
        .mockResolvedValue(deletedRating);

      const result = await ratingService.deleteRating(ratingId);

      expect(result).toEqual(deletedRating);
      expect(ratingModel.findByIdAndDelete).toHaveBeenCalledWith({
        _id: ratingId
      });
    });
  });
  describe('updateRating', () => {
    it('should update a rating by ID', async () => {
      const ratingId = '1';

      const updatedRatingData = new Rating();
      updatedRatingData.workoutId = '1';
      updatedRatingData.athleteId = 1;
      updatedRatingData.rating = 4;

      const updatedRating: Rating = {
        ...updatedRatingData,
        workoutId: ratingId
      };

      jest
        .spyOn(ratingModel, 'findByIdAndUpdate')
        .mockResolvedValue(updatedRating);

      const result = await ratingService.updateRating(
        ratingId,
        updatedRatingData
      );

      expect(result).toEqual(updatedRating);
      expect(ratingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: ratingId },
        updatedRatingData,
        { new: true }
      );
    });
  });

  describe('getAverageRating', () => {
    it('should calculate the average rating for a workout', async () => {
      const workoutId = 'workout1';
      const start = new Date('2022-01-01');
      const end = new Date('2022-12-31');

      const rating1 = new Rating();
      rating1.workoutId = '1';
      rating1.athleteId = 1;
      rating1.rating = 4;

      const rating2 = new Rating();
      rating2.workoutId = '1';
      rating2.athleteId = 2;
      rating2.rating = 5;

      const rating3 = new Rating();
      rating3.workoutId = '1';
      rating3.athleteId = 3;
      rating3.rating = 3;

      const ratings: Rating[] = [rating1, rating2, rating3];

      jest.spyOn(ratingModel, 'find').mockResolvedValue(ratings);

      const expectedAverageRating = 4;

      const result = await ratingService.getAverageRating(
        workoutId,
        start,
        end
      );

      expect(result).toEqual(expectedAverageRating);
      expect(ratingModel.find).toHaveBeenCalledWith({
        workoutId,
        ratedAt: { $gte: start, $lt: end }
      });
    });
  });
});
