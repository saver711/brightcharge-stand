import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateChargePointConnectorsComponent } from './create-charge-point-connectors/create-charge-point-connectors.component';
import { CreateChargePointGeneralComponent } from './create-charge-point-general/create-charge-point-general.component';
import { CreateChargePointSecurityComponent } from './create-charge-point-security/create-charge-point-security.component';
import { CreateChargePointStationComponent } from './create-charge-point-station/create-charge-point-station.component';

@Component({
  selector: 'bs-create-charge-point',
  templateUrl: './create-charge-point.component.html',
  styleUrls: ['./create-charge-point.component.scss'],
})
export class CreateChargePointComponent implements AfterViewInit {
  @ViewChild(CreateChargePointGeneralComponent)
  createChargePointGeneralComponent!: CreateChargePointGeneralComponent;
  @ViewChild(CreateChargePointConnectorsComponent)
  createChargePointConnectorsComponent!: CreateChargePointConnectorsComponent;
  @ViewChild(CreateChargePointStationComponent)
  createChargePointStationComponent!: CreateChargePointStationComponent;
  @ViewChild(CreateChargePointSecurityComponent)
  createChargePointSecurityComponent!: CreateChargePointSecurityComponent;

  // don't use any, add types
  createChargePointForm: FormGroup<any> | undefined;

  isCreating = false;
  formSubmitted = false;

  ngAfterViewInit() {
    this.createChargePointForm = new FormGroup({
      general: this.createChargePointGeneralComponent.generalForm,
      // NOTE: Enable what u need from these after initializing it's form in it's component so it won't throw an error

      // connectors: this.createChargePointConnectorsComponent.connectorsForm,
      station: this.createChargePointStationComponent.stationForm,
      // security: this.createChargePointSecurityComponent.securityForm,
    });
  }
  onSubmit() {
    this.formSubmitted = true;
    const createForm = this.createChargePointForm;

    //  NOTE: Enable what u need from these after initializing it's form in it's component so it won't throw an error
    this.createChargePointGeneralComponent.submitForm();
    // this.createChargePointConnectorsComponent.submitForm();
    this.createChargePointStationComponent.submitForm();
    // this.createChargePointSecurityComponent.submitForm();

    const payload = {
      ...createForm?.value.general,
      //  NOTE: Enable what u need from these after initializing it's form in it's component so it won't throw an error

      // connectors: createForm.value.connectors,
      ...createForm?.value.station,
      // ...createForm.value.security,
    };
    console.log(`🚀payload:`, payload);
    console.log('valid?:', createForm?.valid);
  }
  resetForm() {}
  generalHasError() {
    return (
      !!this.createChargePointForm?.get('general')?.invalid &&
      this.formSubmitted
    );
  }
  connectorsHasError() {}
  stationHasError() {
    return (
      !!this.createChargePointForm?.get('station')?.invalid &&
      this.formSubmitted
    );
  }
  securityHasError() {}
}
