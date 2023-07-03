import { TransformFnParams } from 'class-transformer';

export const booleanMapper = (transformParams: TransformFnParams) => {
  switch (transformParams.value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
};
