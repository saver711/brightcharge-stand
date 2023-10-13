import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '../core/services/auth-guard.service';

import { TokenResolverGuard } from '../core/services/token-resolver.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ForgotPasswordComponent } from '../user-management/components/forgot-password/forgot-password.component';
import { LoginComponent } from '../user-management/components/login/login.component';
import { ResetPasswordComponent } from '../user-management/components/reset-password/reset-password.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';

const securedLayout: Route = {
  path: '',
  component: HomePageComponent,
  // FIXME: uncomment this
  canActivate: [IsLoggedInGuard],
  children: [
    {
      path: '',
      component: MainPageComponent,
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: DashboardComponent,
          data: { breadcrumb: 'Dashboard' },
        },
        {
          path: 'operators',
          data: { breadcrumb: 'Operators' },
          loadChildren: () =>
            import('../operator/operator.module').then(m => m.OperatorModule),
        },
        {
          path: 'stations',
          data: { breadcrumb: 'Stations' },
          loadChildren: () =>
            import('../station/station.module').then(m => m.StationModule),
        },
        {
          path: 'charge-points',
          data: { breadcrumb: 'Charge points' },
          loadChildren: () =>
            import('../charge-point/charge-point.module').then(
              m => m.ChargePointModule
            ),
        },
      ],
    },
    {
      path: 'user-management',
      loadChildren: () =>
        import('../user-management/user-management.module').then(
          m => m.UserManagementModule
        ),
    },
  ],
};

const publicLayout: Route = {
  path: '',
  component: PublicLayoutComponent,
  children: [
    {
      path: 'login',
      component: LoginComponent,
      canActivate: [IsLoggedInGuard],
    },
    {
      path: 'forgot-password',
      component: ForgotPasswordComponent,
      // canActivate: [AuthGuardLogin],
    },
    {
      path: 'reset-password',
      component: ResetPasswordComponent,
      resolve: { isTokenValid: TokenResolverGuard },
    },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
  ],
};

@NgModule({
  imports: [RouterModule.forChild([securedLayout, publicLayout])],
  exports: [RouterModule],
})
export class layoutRoutingModule {}
