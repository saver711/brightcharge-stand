import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DividerModule } from 'primeng/divider';
import { NotFoundComponent } from '../layout/components/not-found/not-found.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { UserManagementRoutingModule } from './user-management-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    SetPasswordComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserManagementRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    DividerModule,
  ],
})
export class UserManagementModule {}
