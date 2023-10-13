import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlockUIModule } from 'primeng/blockui';
import { SharedModule } from '../shared/shared.module';
import { ChargePointRoutingModule } from './charge-point-routing.module';
import { ChargePointAdvancedSearchComponent } from './components/charge-point-advanced-search/charge-point-advanced-search.component';
import { ChargePointsWrapperComponent } from './components/charge-points-wrapper/charge-points-wrapper.component';
import { ChargePointsComponent } from './components/charge-points/charge-points.component';
import { CreateChargePointConnectorsComponent } from './components/create-charge-point/create-charge-point-connectors/create-charge-point-connectors.component';
import { CreateChargePointStationComponent } from './components/create-charge-point/create-charge-point-station/create-charge-point-station.component';
import { CreateChargePointComponent } from './components/create-charge-point/create-charge-point.component';
import { CreateChargePointGeneralComponent } from './components/create-charge-point/create-charge-point-general/create-charge-point-general.component';

@NgModule({
  declarations: [
    ChargePointAdvancedSearchComponent,
    ChargePointsComponent,
    CreateChargePointComponent,
    ChargePointsWrapperComponent,
    CreateChargePointGeneralComponent,
    CreateChargePointStationComponent,
    CreateChargePointConnectorsComponent,
  ],
  imports: [
    CommonModule,
    ChargePointRoutingModule,
    BlockUIModule,
    SharedModule,
  ],
  providers: [],
})
export class ChargePointModule {}
