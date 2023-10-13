import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { appStates } from './state/state.classes';
import { AppSharedModule } from './app-shared/app-shared.module';
export function tokenGetter() {
  return localStorage.getItem('token') || null;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    CoreModule,
    AppSharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: [],
        disallowedRoutes: [
          `api/backoffice/auth/login`,
          'api/backoffice/auth/refresh-token',
          'api/backoffice/auth/password-forgot',
          'api/backoffice/auth/validate-token',
        ],
        // throwNoTokenError: true,
        // skipWhenExpired: false, // add it if it is expired
      },
    }),

    NgxsModule.forRoot(appStates, {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
