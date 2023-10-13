import { PaginationParams } from 'src/app/core/api/api.model';
import { Station } from '../station.model';
import { StationCreationPayload } from '@station/models/station-creation-payload.model';

export class AddStation {
  static readonly type = '[Stations] Add directly to state';
  constructor(public addData: Station) {}
}
export class EditStation {
  static readonly type = '[Stations] Edit';
}

export class FetchStations {
  static readonly type = '[stations] Get';
}
export class PaginateStations {
  static readonly type = '[stations] Paginate';
  constructor(public params: PaginationParams) {}
}
export class ArchiveStations {
  static readonly type = '[stations] Delete';
  constructor(public ids: number[]) {}
}

export class GetCountries {
  static readonly type = '[Locations API] Get all countries';
}

export class GetCities {
  static readonly type = '[Locations API] Get a country cities';
  constructor(public payload: number) {}
}

export class GetStates {
  static readonly type = '[Locations API] Get a city states';
  constructor(public payload: number) {}
}

export class CreateStation {
  static readonly type = '[Locations API] Create a new station/location';
  constructor(public payload: StationCreationPayload) {}
}
