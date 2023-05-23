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
import { axiosErrorCatcher } from './axios-error-catcher';

@Controller()
export class ServerController {
  constructor(protected httpService: HttpService, private entityName: string) {
    this.httpService = httpService;
    this.entityName = entityName;
  }

  @Post()
  public async create(@Body() entity: any) {
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
        .get(`/${this.entityName}`, {
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
  public async update(@Param('id') id: string, @Body() entity: any) {
    const { data } = await firstValueFrom(
      this.httpService
        .put(`/${this.entityName}/${id}`, entity)
        .pipe(catchError(axiosErrorCatcher))
    );

    return data;
  }
}
