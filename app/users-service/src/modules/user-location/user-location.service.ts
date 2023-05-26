import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLocation } from './schema/user-location.schema';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectModel(UserLocation.name)
    private userLocationModel: Model<UserLocation>
  ) {}

  public createLocation(
    userId: number,
    coordinates: [number, number]
  ): Promise<UserLocation> {
    return this.userLocationModel.create({
      userId,
      location: { coordinates, type: 'Point' }
    });
  }

  public async updateLocation(
    userId: number,
    coordinates: [number, number]
  ): Promise<UserLocation> {
    const userLocation = await this.userLocationModel.findOne({ userId });
    if (!userLocation) {
      return this.createLocation(userId, coordinates);
    }

    userLocation.location.coordinates = coordinates;
    userLocation.updatedAt = new Date();
    return userLocation.save();
  }

  public async findUserLocation(userId: number): Promise<UserLocation> {
    const userLocation = await this.userLocationModel.findOne({
      userId
    });

    if (!userLocation) {
      throw new BadRequestException({
        errorView: 'Usuario no tiene ubicacion asociada'
      });
    }

    return userLocation;
  }

  public async findNearestUsers(
    userId: number,
    radius: number
  ): Promise<UserLocation[]> {
    const userLocation = await this.findUserLocation(userId);

    return this.userLocationModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [userLocation.location.coordinates, radius]
        }
      }
    });
  }
}
