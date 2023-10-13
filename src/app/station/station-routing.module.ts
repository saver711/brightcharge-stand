import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateStationComponent } from './components/create-station/create-station.component';
import { StationsWrapperComponent } from './components/stations-wrapper/stations-wrapper.component';
import { StationsComponent } from './components/stations/stations.component';

const stationRoutes: Route = {
  path: '',
  component: StationsWrapperComponent,
  children: [
    {
      path: '',
      component: StationsComponent,
    },
    {
      path: 'new',
      component: CreateStationComponent,
      data: { breadcrumb: 'Add New' },
    },
  ],
};

@NgModule({
  imports: [RouterModule.forChild([stationRoutes])],
  exports: [RouterModule],
})
export class StationRoutingModule {}
