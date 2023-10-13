import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Password } from 'primeng/password';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { NoSpaceValidator } from 'src/app/core/validators/no-space-validator';
import { Logout } from '../../state/user-management.actions';
import { MustMatch } from '../../validators/validator';

type ResetFormControls = {
  newPassword: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup<ResetFormControls>;
  formSubmitted = false;
  isSubmitting = false;
  linkExpired = false;
  showStatusMessage = false;
  passwordUpdatedSuccessfully = false;
  passwordInputFocused = false;
  confirmPasswordInputFocused = false;
  showFallbackComponent = false;
  token = '';
  errorMessage = '';

  @ViewChild('passwordInput') passwordInput!: Password;
  @ViewChild('confirmPasswordInput')
  confirmPasswordInput!: Password;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.route.data.subscribe(data => {
      this.showFallbackComponent = !data['isTokenValid'];
    });

    this.resetForm = new FormGroup(
      {
        newPassword: new FormControl('', [
          Validators.required,
          NoSpaceValidator.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
        confirmPassword: new FormControl(''),
      },
      { validators: MustMatch('newPassword', 'confirmPassword') }
    );
  }

  clearInput(input: keyof ResetFormControls) {
    const formControl = this.resetForm.get(input);
    if (formControl) {
      formControl.setValue('');
      this.focusInput(input);
    }
  }

  focusInput(input: keyof ResetFormControls) {
    const inputElement =
      input === 'newPassword'
        ? this.passwordInput.input.nativeElement
        : this.confirmPasswordInput.input.nativeElement;
    inputElement.focus();
  }

  // NEW PASSWORD ERROR HANDLING
  shouldShowNewPasswordRequiredError() {
    return (
      (this.formSubmitted || this.resetForm.get('newPassword')?.touched) &&
      this.resetForm.get('newPassword')?.errors?.['required'] &&
      !this.passwordInputFocused
    );
  }
  shouldShowNewPasswordLengthError() {
    return (
      !this.shouldShowNewPasswordRequiredError() &&
      (this.resetForm.get('newPassword')?.errors?.['minlength'] ||
        this.resetForm.get('newPassword')?.errors?.['maxlength']) &&
      !this.passwordInputFocused
    );
  }

  newPasswordHasError() {
    return (
      this.shouldShowNewPasswordRequiredError() ||
      this.shouldShowNewPasswordLengthError()
    );
  }

  // CONFIRM PASSWORD ERROR HANDLING
  shouldShowConfirmPasswordError() {
    return (
      (this.formSubmitted || this.resetForm.get('confirmPassword')?.touched) &&
      this.resetForm.get('confirmPassword')?.errors?.['mustMatch'] &&
      !this.confirmPasswordInputFocused &&
      !this.newPasswordHasError()
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.isSubmitting = true;

    const url = `/api/backoffice/auth/password-reset`;
    const newPassword = this.resetForm.get('confirmPassword')?.value;
    const body = { token: this.token, newPassword };

    this.http.patch(url, body).subscribe({
      next: () => {
        this.showStatusMessage = true;
        this.passwordUpdatedSuccessfully = true;
        this.isSubmitting = false;
        this.formSubmitted = false;
        this.store.dispatch(new Logout());
      },
      error: (error: ErrorResponse) => {
        this.linkExpired = true;
        this.showStatusMessage = true;
        this.isSubmitting = false;
        this.formSubmitted = false;
        // FIXME: the returned errorCode from the backend needs to be changed
        this.errorMessage = getErrorMessage(error.error.errorCode);
      },
    });
  }

  closeMessage() {
    this.showStatusMessage = false;
  }

  // ......
}
