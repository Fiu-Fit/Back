import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { EditRatingDto, RatingDto } from './dto';
// import { AuthGuard } from '../auth/auth.guard';

@Injectable()
@Controller('ratings')
export class RatingController {
  private readonly entityName = 'ratings';

  constructor(private httpService: HttpService) {}

  @Post()
  public async createRating(@Body() rating: RatingDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, rating)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async getRatings(@Query() params: { [key: string]: string }) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}`, {
          params: params
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async getRatingById(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteRating(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async updateRating(
    @Param('id') id: string,
    @Body() rating: EditRatingDto
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, rating)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
