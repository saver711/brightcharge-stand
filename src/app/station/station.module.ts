import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateStationComponent } from './components/create-station/create-station.component';
import { StationAdvancedSearchComponent } from './components/station-advanced-search/station-advanced-search.component';
import { StationsWrapperComponent } from './components/stations-wrapper/stations-wrapper.component';
import { StationsComponent } from './components/stations/stations.component';
import { StationRoutingModule } from './station-routing.module';
import { CreateStationGeneralComponent } from './components/create-station/create-station-general/create-station-general.component';
import { CreateStationAmenitiesComponent } from './components/create-station/create-station-amenities/create-station-amenities.component';
import { CreateStationWorkingHoursComponent } from './components/create-station/create-station-working-hours/create-station-working-hours.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    StationAdvancedSearchComponent,
    StationsComponent,
    CreateStationComponent,
    StationsWrapperComponent,
    CreateStationGeneralComponent,
    CreateStationAmenitiesComponent,
    CreateStationWorkingHoursComponent,
  ],
  imports: [CommonModule, StationRoutingModule, SharedModule],
  providers: [],
})
export class StationModule {}
