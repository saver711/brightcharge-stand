import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'bs-create-charge-point-connectors',
  templateUrl: './create-charge-point-connectors.component.html',
  styleUrls: ['./create-charge-point-connectors.component.scss'],
})
export class CreateChargePointConnectorsComponent {
  // don't use any, add types
  connectorsForm!: FormArray<any>;

  submitForm() {}
}
