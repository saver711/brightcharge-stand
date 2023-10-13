import { FormGroup } from '@angular/forms';

export class PasswordValidators {
  static passwordsShouldMatch(group: FormGroup) {
    const Password = group.controls['password'].value;
    const confirmPassword = group.controls['confirmPassword'].value;

    // If either of these fields is empty, the validation
    // will be bypassed. We expect the required validator to be
    // applied first.
    if (Password == '' || confirmPassword == '') {
      return null;
    }

    if (Password != confirmPassword) {
      return { passwordsShouldMatch: true };
    }

    return null;
  }
}
