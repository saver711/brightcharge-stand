import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { NoSpaceValidator } from 'src/app/core/validators/no-space-validator';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'bs-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isSendingEmail = false;
  emailSentSuccessfully = false;
  showStatusMessage = false;
  formSubmitted = false;
  errorMessage = '';
  forgotForm!: FormGroup<{ username: FormControl<string | null> }>;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private store: Store,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.forgotForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        NoSpaceValidator.noWhitespaceValidator,
      ]),
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    this.isSendingEmail = true;

    const usernameValue = this.forgotForm.value.username?.trim();

    this.emailSentSuccessfully = false;
    this.showStatusMessage = false;
    if (usernameValue) {
      this.userManagementService.emailRecoveryLink(usernameValue).subscribe({
        next: () => {
          this.emailSentSuccessfully = true;
          this.isSendingEmail = false;
          this.showStatusMessage = true;
        },
        error: (error: ErrorResponse) => {
          this.errorMessage = getErrorMessage(error.error.errorCode);
          this.emailSentSuccessfully = false;
          this.isSendingEmail = false;
          this.showStatusMessage = true;
        },
      });
    }
  }

  closeMessage() {
    this.showStatusMessage = false;
  }
}
