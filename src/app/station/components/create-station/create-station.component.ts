import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Days, WorkingHoursDtoControls } from '../../station.model';
import { CreateStationGeneralComponent } from '@station/components/create-station/create-station-general/create-station-general.component';
import { Store } from '@ngxs/store';
import { CreateStation } from '@station/state/station.actions';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { MessageService } from 'primeng/api';
import { CreateStationAmenitiesComponent } from './create-station-amenities/create-station-amenities.component';

@Component({
  selector: 'bs-create-station',
  templateUrl: './create-station.component.html',
  styleUrls: ['./create-station.component.scss'],
})
export class CreateStationComponent implements AfterViewInit {
  @ViewChild(CreateStationGeneralComponent)
  generalInfoComponent!: CreateStationGeneralComponent;
  @ViewChild(CreateStationAmenitiesComponent)
  amenitiesComponent!: CreateStationAmenitiesComponent;
  createStationForm!: FormGroup;
  isCreatedLoading = false;
  activeIndex = 0;
  alwaysOpen = false;
  formSubmitted = false;
  resetAlwaysOpen = false;

  constructor(
    private store: Store,
    private messageService: MessageService
  ) {
    this.initializeTheForm();
  }

  initializeTheForm() {
    const days = [
      Days.SATURDAY,
      Days.SUNDAY,
      Days.MONDAY,
      Days.THURSDAY,
      Days.WEDNESDAY,
      Days.THURSDAY,
      Days.FRIDAY,
    ];
    const initialWorkingHoursDtos: FormGroup<WorkingHoursDtoControls>[] =
      days.map(
        val =>
          new FormGroup<WorkingHoursDtoControls>({
            day: new FormControl(val),
            openingTime: new FormControl(
              { value: null, disabled: false },
              Validators.pattern(`^(0?[1-9]|1[0-2]):[0-5][0-9]$`)
            ),
            closingTime: new FormControl(
              { value: null, disabled: false },
              Validators.pattern(`^(0?[1-9]|1[0-2]):[0-5][0-9]$`)
            ),
            fromTime: new FormControl({ value: 'AM', disabled: false }),
            toTime: new FormControl({ value: 'PM', disabled: false }),
            openAllDay: new FormControl(false),
          })
      );

    this.createStationForm = new FormGroup({
      workingHours: new FormArray(initialWorkingHoursDtos),
      amenities: new FormGroup({}),
      generalInfo: new FormGroup({}, Validators.required),
      alwaysOpen: new FormControl(false),
    });
  }

  ngAfterViewInit() {
    const days = [
      Days.SATURDAY,
      Days.SUNDAY,
      Days.MONDAY,
      Days.THURSDAY,
      Days.WEDNESDAY,
      Days.THURSDAY,
      Days.FRIDAY,
    ];
    const initialWorkingHoursDtos: FormGroup<WorkingHoursDtoControls>[] =
      days.map(
        val =>
          new FormGroup<WorkingHoursDtoControls>({
            day: new FormControl(val),
            openingTime: new FormControl(
              { value: null, disabled: false },
              Validators.pattern(`^(0?[1-9]|1[0-2]):[0-5][0-9]$`)
            ),
            closingTime: new FormControl(
              { value: null, disabled: false },
              Validators.pattern(`^(0?[1-9]|1[0-2]):[0-5][0-9]$`)
            ),
            fromTime: new FormControl({ value: 'AM', disabled: false }),
            toTime: new FormControl({ value: 'PM', disabled: false }),
            openAllDay: new FormControl(false),
          })
      );

    this.createStationForm = new FormGroup({
      workingHours: new FormArray(initialWorkingHoursDtos),
      amenities: this.amenitiesComponent?.amenities,
      generalInfo: this.generalInfoComponent?.generalInfoGroup,
      alwaysOpen: new FormControl(false),
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    this.createStationForm.updateValueAndValidity();
    this.createStationForm.markAllAsTouched();
    if (this.createStationForm.invalid) return;

    const createStationPayload = {
      amenities: this.createStationForm.value.amenities,
      alwaysOpen: this.createStationForm.value.alwaysOpen,
      ...this.createStationForm.value.generalInfo,
      workingHours: this.createStationForm.value.workingHours,
    };
    this.isCreatedLoading = true;
    delete createStationPayload.country;

    this.store.dispatch(new CreateStation(createStationPayload)).subscribe({
      next: () => {
        this.isCreatedLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Station Created',
          detail: `${createStationPayload.name} station was created successfully.`,
        });
        this.resetForm();
      },
      error: (error: ErrorResponse) => {
        this.isCreatedLoading = false;
        const errorMessage = getErrorMessage(error.error.errorCode);
        this.messageService.add({
          severity: 'error',
          summary: 'Station Creation failed',
          detail: errorMessage,
        });
      },
    });
  }

  resetForm() {
    this.initializeTheForm();
    this.generalInfoComponent.generalInfoGroup.reset();
    this.amenitiesComponent.amenities.reset();
    this.formSubmitted = false;
    this.resetAlwaysOpen = false;
  }

  viewDetails() {
    console.log('go to details');
  }

  onReject() {
    this.messageService.clear();
  }
  generalHasError() {
    return (
      this.createStationForm.get('generalInfo')?.invalid && this.formSubmitted
    );
  }
}
