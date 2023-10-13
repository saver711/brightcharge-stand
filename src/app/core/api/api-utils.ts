import { ErrorCodes } from './api.model';

export const getErrorMessage = (errorCode: ErrorCodes, isPlural = false) => {
  const fallbackMessage = 'Unknown error occurred';
  const message = isPlural
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      {
        CHARGE_POINT_DELETE_ERROR:
          'can’t be deleted as they are enabled, please disable them first before deletion.',
      }[errorCode]
    : {
        USER_AUTHENTICATION_FAILED:
          'Invalid username or password, please check your credentials and try again',

        USER_NOT_FOUND: 'forgot-form.messages.error',

        USER_RESET_TOKEN_NOT_FOUND: 'reset-form.messages.error-link-expired',
        USER_TOKEN_EXPIRED_EXCEPTION: 'reset-form.messages.error-link-expired',
        ACCESS_TOKEN_EXPIRED: 'Token expired',
        DUPLICATE_RESOURCE: 'Duplicate Record',
        CPO_NOT_EXIST: "Couldn't find this operator",
        CHARGE_POINT_NOT_FOUND: 'Charge point not found',

        CHARGE_POINT_DELETE_ERROR:
          'can’t be deleted as it is enabled, please disable it first before deletion.',
      }[errorCode];

  return message || fallbackMessage;
};

export const getSortDirection = (sortOrder = '1') => {
  const direction = {
    '-1': 'DESC',
    '1': 'ASC',
  }[sortOrder];

  return direction;
};
