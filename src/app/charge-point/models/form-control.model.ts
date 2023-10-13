import { FormControl } from '@angular/forms';
//TODO: Remove any

// General Tab form controls
export type GeneralFormControls = {
  name: FormControl<string | null | any>;
  minPower: FormControl<number | null | any>;
  maxPower: FormControl<number | null | any>;
  access: FormControl<string | null | any>;
  brandId: FormControl<number | null | any>;
  modelId: FormControl<number | null | any>;
  cpoId: FormControl<number | null | any>;
};

// Station Tab from control
export type StationFormControls = {
  locationId: FormControl<number | null | any>;
};
