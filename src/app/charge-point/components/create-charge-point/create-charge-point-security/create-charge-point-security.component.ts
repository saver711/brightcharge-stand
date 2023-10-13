import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'bs-create-charge-point-security',
  templateUrl: './create-charge-point-security.component.html',
  styleUrls: ['./create-charge-point-security.component.scss'],
})
export class CreateChargePointSecurityComponent {
  // don't use any, add types
  securityForm!: FormGroup<any>;

  submitForm() {}
}
