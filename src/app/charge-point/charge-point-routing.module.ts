import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChargePointsWrapperComponent } from './components/charge-points-wrapper/charge-points-wrapper.component';
import { ChargePointsComponent } from './components/charge-points/charge-points.component';
import { CreateChargePointComponent } from './components/create-charge-point/create-charge-point.component';

const chargePointRoutes: Route = {
  path: '',
  component: ChargePointsWrapperComponent,
  children: [
    {
      path: '',
      component: ChargePointsComponent,
    },
    {
      path: 'new',
      component: CreateChargePointComponent,
      data: { breadcrumb: 'Add New' },
    },
  ],
};

@NgModule({
  imports: [RouterModule.forChild([chargePointRoutes])],
  exports: [RouterModule],
})
export class ChargePointRoutingModule {}
