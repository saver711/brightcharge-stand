import { AuditData, PaginationProps } from '../core/api/api.model';
import { TableDataTypes } from '@shared/components/table/table.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { User } from '../user/user.model';

export type BEStation = {
  id: number;
  name: string;
  city: string;
  state: string;
  numberOfChargePoints: number;
  country: string;
  address: string;
  locationAccessType: LocationAccessType;
  verified: boolean;
} & AuditData;

export type StationsResponse = { content: BEStation[] } & PaginationProps;

enum LocationAccessType {
  PRIVATE = 'PRIVATE',
  PUBLIC_ACCESS = 'PUBLIC_ACCESS',
}

export type Station = {
  id: number;
  name: string;
  city: string;
  state: string;
  numberOfChargePoints: number;
  country: string;
  address: string;
  locationAccessType: LocationAccessType;
  verified: boolean;
} & AuditData;

export type StationsTable = { content: StationTable[] } & PaginationProps;
export type StationTable = {
  id: number;
  name: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  city: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  state: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  numberOfChargePoints: {
    type: TableDataTypes.HIGHLIGHTED;
    value: number;
  };
  verified: {
    type: TableDataTypes.BOOLEAN;
    value: boolean;
  };
  createdBy: {
    type: TableDataTypes.HIGHLIGHTED;
    value: string;
  };
  lastModifiedBy: {
    type: TableDataTypes.HIGHLIGHTED;
    value: string;
  };
  creationDate: {
    type: TableDataTypes.TEXT;
    value: string;
  };
  lastModifiedDate: {
    type: TableDataTypes.TEXT;
    value: string;
  };
};

export type ConvertedStations = { content: Station[] } & PaginationProps;

export type StationStateModel = {
  stations: ConvertedStations | null;
};

export type AddStationFormControls = {
  workingHours: FormArray<FormGroup<WorkingHoursDtoControls>>;
  amenities: FormArray<FormControl>;
  alwaysOpen: FormControl<boolean>;
};
export type WorkingHoursDtoControls = {
  day: FormControl<Days | null>;
  openingTime: FormControl<string | null>;
  closingTime: FormControl<string | null>;
  fromTime: FormControl<string | null>;
  toTime: FormControl<string | null>;
  openAllDay: FormControl<boolean | null>;
};
export type WorkingHoursDto = {
  day: string;
  openingTime: string;
  closingTime: string;
  fromTime: string;
  toTime: string;
  openAllDay: boolean;
};

export enum Days {
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
}

export type Amenity = {
  name: string;
  value: string;
  icon: string;
};

export type AccessType = {
  label: string;
  value: string;
};

export type SearchFormControls = {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  locationAccessType: FormControl<string | null>;
  country: FormControl<string | null>;
  city: FormControl<string | null>;
  state: FormControl<string | null>;
  amenities: FormControl<string[] | null>;
  createdBy: FormControl<User[] | null>;
  creationDate: FormControl<Date | null>;
  creationDateTo: FormControl<Date | null>;
  lastModifiedBy: FormControl<User[] | null>;
  lastModifiedDate: FormControl<Date | null>;
  lastModifiedDateTo: FormControl<Date | null>;
};
