import { NgModule } from '@angular/core';
import { OperatorsComponent } from './components/operators/operators.component';
import { OperatorRoutingModule } from './operator-routing.module';
import { AddOperatorComponent } from './components/add-operator/add-operator.component';
import { NewOperatorGeneralComponent } from './components/add-operator/new-operator-general/new-operator-general.component';
import { NewOperatorLegalComponent } from './components/add-operator/new-operator-legal/new-operator-legal.component';
import { NewOperatorSubscriptionComponent } from './components/add-operator/new-operator-subscription/new-operator-subscription.component';
import { OperatorAdvancedSearchComponent } from './components/operator-advanced-search/operator-advanced-search.component';
import { OperatorsWrapperComponent } from './components/operators-wrapper/operators-wrapper.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { OperatorComponent } from './components/operator/operator.component';
import { EditOperatorComponent } from './components/edit-operator/edit-operator.component';
import { OperatorWrapperComponent } from './components/operator-wrapper/operator-wrapper.component';
import { EditOperatorGeneralComponent } from './components/edit-operator/edit-operator-general/edit-operator-general.component';
import { EditOperatorLegalComponent } from './components/edit-operator/edit-operator-legal/edit-operator-legal.component';
import { EditOperatorSubscriptionComponent } from './components/edit-operator/edit-operator-subscription/edit-operator-subscription.component';
import { AppSharedModule } from '../app-shared/app-shared.module';

@NgModule({
  declarations: [
    OperatorAdvancedSearchComponent,
    OperatorsComponent,
    AddOperatorComponent,
    OperatorsWrapperComponent,
    NewOperatorGeneralComponent,
    NewOperatorLegalComponent,
    NewOperatorSubscriptionComponent,
    OperatorComponent,
    EditOperatorComponent,
    OperatorWrapperComponent,
    EditOperatorGeneralComponent,
    EditOperatorLegalComponent,
    EditOperatorSubscriptionComponent,
  ],
  imports: [
    OperatorRoutingModule,
    HttpClientModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class OperatorModule {}
