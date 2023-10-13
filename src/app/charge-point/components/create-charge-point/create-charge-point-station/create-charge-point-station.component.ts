import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { FetchStations } from './../../../../station/state/station.actions';
import { StationState } from '@station/state/station.state';
import { StationFormControls } from './../../../models/form-control.model';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Station } from '@station/station.model';
import { Observable, withLatestFrom } from 'rxjs';

@Component({
  selector: 'bs-create-charge-point-station',
  templateUrl: './create-charge-point-station.component.html',
  styleUrls: ['./create-charge-point-station.component.scss'],
})
export class CreateChargePointStationComponent {
  // don't use any, add types
  stationForm!: FormGroup<StationFormControls>;
  isFetchingStations = false;
  fetchingStationsError: string | null = null;
  stationOptions: Station[] = [];

  formSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  @Select(StationState.stations) stations$!: Observable<Station[]>;

  fetchStations() {
    this.isFetchingStations = true;
    this.fetchingStationsError = null;
    this.store
      .dispatch(new FetchStations())
      .pipe(withLatestFrom(this.stations$))
      .subscribe({
        next: ([_, stations]) => {
          this.stationOptions = stations;
          this.isFetchingStations = false;
        },
        error: (error: ErrorResponse) => {
          this.isFetchingStations = false;
          this.fetchingStationsError = getErrorMessage(error.error.errorCode);
        },
      });
  }

  ngOnInit(): void {
    this.fetchStations();
    this.stationForm = this.fb.group({
      locationId: [null, [Validators.required]],
    });
  }
  submitForm() {
    this.formSubmitted = true;
  }
}
