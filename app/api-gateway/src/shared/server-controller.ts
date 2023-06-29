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
import { ApiOperation } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { axiosErrorCatcher } from './axios-error-catcher';

@Controller()
export class ServerController<T> {
  constructor(protected httpService: HttpService, private entityName: string) {
    this.httpService = httpService;
    this.entityName = entityName;
  }

  @Post()
  @ApiOperation({ summary: 'Get a user by ID' })
  public async create(@Body() entity: T): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<T>(this.entityName, entity)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get()
  public async findAll(
    @Query() params: { [key: string]: string }
  ): Promise<T[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<T[]>(`/${this.entityName}`, {
          params: params
        })
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<T>(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Delete(':id')
  public async deleteById(@Param('id') id: string): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService
        .delete<T>(`/${this.entityName}/${id}`)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() entity: Partial<T>
  ): Promise<T> {
    const { data } = await firstValueFrom(
      this.httpService
        .put<T>(`/${this.entityName}/${id}`, entity)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
