import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { NoSpaceValidator } from 'src/app/core/validators/no-space-validator';
import { UserManagementService } from '../../services/user-management.service';
import { Login } from '../../state/user-management.actions';

@Component({
  selector: 'bs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  passwordInputFocused = false;
  isTryingToLogin = false;
  showStatusMessage = false;
  loginSuccessfully = false;
  afterNavigationMessage!: string | null;
  errorMessage = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private userManagementService: UserManagementService
  ) {
    this.authForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required, NoSpaceValidator.noWhitespaceValidator],
      ],
      password: ['', Validators.required],
      rememberMe: [],
    });
  }

  ngOnInit(): void {
    this.afterNavigationMessage =
      this.router.getCurrentNavigation()?.extras.state?.['message'];
  }

  loginUser(event: { preventDefault: () => void; target: any }) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    }
    this.isTryingToLogin = true;
    event.preventDefault();
    const username = this.authForm.controls['username'].value;
    const password = this.authForm.controls['password'].value;
    const rememberMe = this.authForm.controls['rememberMe'].value;

    this.loginSuccessfully = false;
    this.showStatusMessage = false;
    this.store
      .dispatch(new Login(username, password, rememberMe))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          const LoginModel = res.session;
          if (LoginModel.loggedIn) {
            this.isTryingToLogin = false;
            this.loginSuccessfully = true;
            const path = this.userManagementService.getUserRootPath();
            this.router.navigate([path]);
          }
        },
        error: (error: ErrorResponse) => {
          this.isTryingToLogin = false;
          this.loginSuccessfully = false;
          this.showStatusMessage = true;
          this.errorMessage = getErrorMessage(error.error.errorCode);
        },
      });
  }

  shouldShowPasswordError() {
    return (
      (this.submitted || this.authForm.get('password')?.touched) &&
      !this.passwordInputFocused &&
      this.authForm.get('password')?.invalid
    );
  }

  closeMessage() {
    this.showStatusMessage = false;
  }
}
