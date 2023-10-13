import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddOperatorComponent } from './components/add-operator/add-operator.component';
import { OperatorComponent } from './components/operator/operator.component';
import { OperatorsWrapperComponent } from './components/operators-wrapper/operators-wrapper.component';
import { OperatorsComponent } from './components/operators/operators.component';
import { OperatorResolverGuard } from './services/operator-resolver/operator-resolver.service';
import { EditOperatorComponent } from './components/edit-operator/edit-operator.component';
import { OperatorWrapperComponent } from './components/operator-wrapper/operator-wrapper.component';

const operatorRoutes: Route = {
  path: '',
  component: OperatorsWrapperComponent,
  children: [
    {
      path: '',
      component: OperatorsComponent,
    },
    {
      path: 'new',
      component: AddOperatorComponent,
      data: { breadcrumb: 'Add New' },
    },
    {
      path: ':operatorId',
      component: OperatorWrapperComponent,
      resolve: { data: OperatorResolverGuard },
      children: [
        {
          path: '',
          component: OperatorComponent,
          resolve: { data: OperatorResolverGuard },
        },
        {
          path: 'edit',
          component: EditOperatorComponent,
          resolve: { data: OperatorResolverGuard },
        },
      ],
    },
  ],
};

@NgModule({
  imports: [RouterModule.forChild([operatorRoutes])],
  exports: [RouterModule],
})
export class OperatorRoutingModule {}
