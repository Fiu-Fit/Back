import { RatingCount } from '@fiu-fit/common';
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sumBy } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { EditRatingDto, RatingDto } from './dto';
import { Rating } from './schemas/rating.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private ratingModel: Model<Rating>
  ) {}

  createRating(newRating: RatingDto): Promise<Rating> {
    return this.ratingModel.create(newRating);
  }

  getRatings(
    filters?: Record<
      string,
      string | number | [number, number] | { $gte: number; $lte: number }
    >
  ): Promise<Rating[]> {
    if (filters?.rating && Array.isArray(filters.rating)) {
      const [lower, upper] = filters.rating;
      filters.rating = { $gte: lower, $lte: upper };
    }

    return this.ratingModel.find({
      ...filters
    });
  }

  async getRatingById(id: string): Promise<Rating> {
    const rating = await this.ratingModel.findById({ _id: id });
    if (!rating) {
      throw new BadRequestException('Exercise not found');
    }
    return rating;
  }

  async deleteRating(id: string): Promise<Rating> {
    const rating = await this.ratingModel.findByIdAndDelete({ _id: id });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return rating;
  }

  async updateRating(id: string, exercise: EditRatingDto): Promise<Rating> {
    const updatedRating = await this.ratingModel.findByIdAndUpdate(
      { _id: id },
      exercise,
      { new: true }
    );
    if (!updatedRating) {
      throw new NotFoundException('Exercise not found');
    }
    return updatedRating;
  }

  async getAverageRating(
    workoutId: string,
    start?: Date,
    end?: Date
  ): Promise<number> {
    const ratings = await this.ratingModel.find({
      workoutId,
      ratedAt: {
        $gte: start ? new Date(start) : new Date(0),
        $lt:  end ? new Date(end) : new Date()
      }
    });

    if (!ratings) {
      throw new BadRequestException('No ratings found');
    }
    return Math.round(sumBy(ratings, 'rating') / ratings.length);
  }

  async getRatingCountPerValue(
    workoutId: string,
    start?: Date,
    end?: Date
  ): Promise<RatingCount[]> {
    const ratingsByValue = await this.ratingModel.aggregate([
      {
        $match: {
          workoutId: new ObjectId(workoutId),
          ratedAt:   {
            $gte: start ? new Date(start) : new Date(0),
            $lt:  end ? new Date(end) : new Date()
          }
        }
      },
      {
        $group: {
          _id:   '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    if (!ratingsByValue) {
      throw new BadRequestException('No ratings found');
    }

    const completeRatingsByValue = [];

    for (let i = 1; i <= 5; i++) {
      const currentRating = ratingsByValue.find(rating => rating._id === i) || {
        _id:   i,
        count: 0
      };

      completeRatingsByValue.push({
        rating: currentRating._id,
        count:  currentRating.count
      });
    }

    return completeRatingsByValue;
  }
}
