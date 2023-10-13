import { AbstractControl, ValidatorFn } from '@angular/forms';

export function egyptianPhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Return null if the input is empty
    }

    const phoneNumberPattern = /^(20|0020|\+20|0)?(11|12|10|15)\d{8}$/;
    const isValid = phoneNumberPattern.test(control.value);

    return isValid ? null : { egyptianPhoneNumber: { value: control.value } };
  };
}
