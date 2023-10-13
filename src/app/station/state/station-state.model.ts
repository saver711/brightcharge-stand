import { City, Country, State } from '@shared/models/location.model';
import { ConvertedStations } from '@station/station.model';

export interface StationStateModel {
  stations?: ConvertedStations;
  countries?: Country[];
  cities?: City[];
  states?: State[];
}
