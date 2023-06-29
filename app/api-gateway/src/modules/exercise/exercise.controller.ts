import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from '../../shared/axios-error-catcher';
import { EditExerciseDto, ExerciseDto } from './dto';

@Controller('exercises')
export class ExerciseController {
  private readonly entityName: string;

  constructor(protected httpService: HttpService) {
    this.httpService = httpService;
    this.entityName = 'exercises';
  }

  @Post()
  public async createExercise(@Body() entity: ExerciseDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(this.entityName, entity)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async findAll(@Query() params: { [key: string]: string }) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(this.entityName, {
          params: params
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteById(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .delete(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() entity: EditExerciseDto
  ) {
    console.log(entity);
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, entity)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
