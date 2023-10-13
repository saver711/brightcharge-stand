import { AbstractControl, Validators } from '@angular/forms';

export class NoSpaceValidator {
  static noWhitespaceValidator(control: AbstractControl) {
    if (NoSpaceValidator.isPresent(Validators.required(control))) {
      return null;
    }
    const isWhitespace = (control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { noWhitespaceValidator: true };
  }

  static isPresent(obj: any): boolean {
    return obj !== undefined && obj !== null;
  }
}
