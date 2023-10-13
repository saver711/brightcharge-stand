import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function formHasValue(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;

    const hasValue = Object.keys(formGroup.controls).some(controlName => {
      const controlValue = formGroup.get(controlName)?.value;
      return (
        (!Array.isArray(controlValue) && !!controlValue) ||
        (Array.isArray(controlValue) && controlValue.length > 0)
      );
    });

    return hasValue ? null : { formHasNoValue: true };
  };
}
