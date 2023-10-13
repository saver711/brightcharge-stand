import { HttpStatusCode } from '@angular/common/http';
import { SafeUrl } from '@angular/platform-browser';

export enum ErrorCodes {
  USER_AUTHENTICATION_FAILED = 'USER_AUTHENTICATION_FAILED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_RESET_TOKEN_NOT_FOUND = 'USER_RESET_TOKEN_NOT_FOUND',
  USER_TOKEN_EXPIRED_EXCEPTION = 'USER_TOKEN_EXPIRED_EXCEPTION',
  ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  CPO_NOT_EXIST = 'CPO_NOT_EXIST',
  CHARGE_POINT_DELETE_ERROR = 'CHARGE_POINT_DELETE_ERROR',
  CHARGE_POINT_NOT_FOUND = 'CHARGE_POINT_NOT_FOUND',
}
export const ELEMENTS_PER_PAGE = 5;
export type ErrorResponse = {
  status: HttpStatusCode;
  ok: boolean;
  error: {
    errorCode: ErrorCodes;
    errorMessage: string;
  };
};

export type PaginationProps = {
  totalElements?: number;
  totalPages?: number;
};

export type SearchCriteria = {
  filterValue?: string;
  filterKey: string;
  value: string;
};

export type PaginationParams = {
  pageNum: number;
  pageSize?: number;
  sortBy?: string | string[] | null | undefined;
  direction?: string;
  searchCriteria?: SearchCriteria[];
};

export type BSFile = File & { objectURL: SafeUrl };

export type AuditData = {
  createdBy: string;
  lastModifiedBy: string;
  creationDate: string;
  lastModifiedDate: string;
};

export enum Status {
  Available = 'Available',
  Unavailable = 'Unavailable',
  Faulted = 'Faulted',
}

export enum Access {
  COMMERCIAL_ACCESS = 'COMMERCIAL_ACCESS',
  PRIVATE_ACCESS = 'PRIVATE_ACCESS',
  PUBLIC_ACCESS = 'PUBLIC_ACCESS',
}
