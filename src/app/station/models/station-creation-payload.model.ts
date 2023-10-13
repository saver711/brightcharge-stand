import { Amenity } from '@station/station.model';
import { LocationAccessType } from '@station/models/location-access-type.enum';
import { WorkingHours } from '@station/models/working-hours.model';

export interface StationCreationPayload {
  name: string;
  address: string;
  alwaysOpen: boolean;
  stateId: number;
  cityId: number;
  latitude: number;
  longitude: number;
  locationAccessType: LocationAccessType;
  amenities: Amenity[];
  workingHours: WorkingHours[];
}
