import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator function
export function dateNotBefore(beforeControlName: string): ValidatorFn {
  return (formControl: AbstractControl): ValidationErrors | null => {
    const beforeControl = formControl.root.get(beforeControlName);

    if (formControl && beforeControl) {
      const date = formControl.value as Date;
      const beforeDate = beforeControl.value as Date;

      if (date && beforeDate && date < beforeDate) {
        return { dateNotBefore: true };
      }
    }

    return null;
  };
}
