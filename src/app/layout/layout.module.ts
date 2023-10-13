import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { layoutRoutingModule } from './layout-routing.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AnonymousUserSectionComponent } from '../user-management/components/anonymous-user-section/anonymous-user-section.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomePageComponent,
    PublicLayoutComponent,
    MainPageComponent,
    AnonymousUserSectionComponent,
    SideNavComponent,
    ForbiddenComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    layoutRoutingModule,
    SharedModule,
  ],
  providers: [],
})
export class LayoutModule {}
