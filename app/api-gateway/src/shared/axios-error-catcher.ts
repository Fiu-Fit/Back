import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';

export const axiosErrorCatcher = (error: AxiosError) => {
  if (error.response) {
    throw new HttpException(
      error.response.data as string,
      error.response.status
    );
  }
  throw new InternalServerErrorException(error.message);
};
