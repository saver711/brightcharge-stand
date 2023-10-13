import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { City, Country, State } from '@shared/models/location.model';
import {
  GetCities,
  GetCountries,
  GetStates,
} from '@station/state/station.actions';
import { StationState } from '@station/state/station.state';
import { OverlayOptions } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { getErrorMessage } from 'src/app/core/api/api-utils';
import { ErrorResponse } from 'src/app/core/api/api.model';
import { isTouchDevice } from 'src/app/core/utils/isTouchDevice';
import { preventClosingPrimeOverlay } from 'src/app/core/utils/prevent-closing-prime-overlay';
import { SearchFormControls } from 'src/app/operator/operator.model';
import { Position } from 'src/app/shared/shared.model';
import { accessType, amenities } from '@station/utils/constants';
import { GetUsers } from 'src/app/user/state/user.actions';
import { User } from 'src/app/user/user.model';
import { AccessType, Amenity } from '../../station.model';
import { StationService } from '@station/services/station.service';
import { AppliedFilter } from '@shared/components/table/table.model';
import { UserState } from 'src/app/user/state/user.state';

@Component({
  selector: 'bs-station-advanced-search',
  templateUrl: './station-advanced-search.component.html',
  styleUrls: ['./station-advanced-search.component.scss'],
})
export class StationAdvancedSearchComponent implements OnInit, OnDestroy {
  @Input() position!: Position;
  @Input() visibility!: boolean;
  @Input() searchForm!: FormGroup<SearchFormControls>;
  @Input() formSubmitted = false;
  @Output() handleClose = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onShowEmitter = new EventEmitter();
  @Output() triggerFilter = new EventEmitter();
  @Output() passAppliedFilters = new EventEmitter<AppliedFilter[]>();
  accessType: AccessType[] = accessType;
  selectedAmenities: string[] = [];
  amenitiesDto!: FormArray;
  amenities: Amenity[] = amenities;
  isFetchingUsers = false;
  fetchingUsersError: string | null = null;
  searchingError: string | null = null;
  private ngUnsubscribe = new Subject<void>();
  @Select(StationState.countries) countries$: Observable<Country[]> | undefined;
  @Select(StationState.cities) cities$: Observable<City[]> | undefined;
  @Select(StationState.states) states$: Observable<State[]> | undefined;
  @Select(UserState.users) users$!: Observable<User[]>;
  countries: Country[] | undefined;
  cities: City[] | undefined;
  states: State[] | undefined;
  users: User[] | undefined;

  constructor(
    private store: Store,
    private stationService: StationService
  ) {}

  getUsers() {
    this.isFetchingUsers = true;
    this.fetchingUsersError = null;
    this.store
      .dispatch(new GetUsers())
      .pipe(withLatestFrom(this.users$))
      .subscribe({
        next: ([_, users]) => {
          this.users = users;
          this.isFetchingUsers = false;
        },
        error: (error: ErrorResponse) => {
          this.fetchingUsersError = getErrorMessage(error.error.errorCode);
          this.isFetchingUsers = false;
        },
      });
  }
  ngOnInit() {
    this.getUsers();

    this.store.dispatch(new GetCountries());
    this.countries$
      ?.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(countries => {
        countries ? (this.countries = countries) : '';
      });
    this.cities$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(cities => {
      this.cities = cities;
    });
    this.states$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(states => {
      this.states = states;
    });
  }
  controlOnChange() {
    (this.searchForm.get('amenities') as unknown as FormArray).clear();
    this.amenitiesDto = this.searchForm.get(
      'amenities'
    ) as unknown as FormArray;
    this.selectedAmenities.forEach(amenity => {
      this.amenitiesDto.push(new FormControl(amenity));
    });
  }
  close() {
    this.handleClose.emit();
  }
  onShow() {
    this.onShowEmitter.emit();
  }
  onSubmit() {
    this.formSubmitted = true;

    const formValue = this.searchForm.value;
    const appliedFilters =
      this.stationService.getTableAppliedFilters(formValue);
    this.passAppliedFilters.emit(appliedFilters);

    this.triggerFilter.emit();
    this.close();
  }
  onReset() {
    this.searchForm.reset();
  }
  getDropdownOverlayOptions(): OverlayOptions {
    return preventClosingPrimeOverlay();
  }
  isTouchDevice() {
    return isTouchDevice();
  }

  get country() {
    return this.searchForm.get('country');
  }

  get city() {
    return this.searchForm.get('city');
  }

  get state() {
    return this.searchForm.get('state');
  }

  get creationDateTo() {
    return this.searchForm.get('creationDateTo');
  }

  get lastModifiedDateTo() {
    return this.searchForm.get('lastModifiedDateTo');
  }
  get amenitiesControl() {
    return this.searchForm.get('amenities') as unknown as FormControl;
  }

  handleCountryChange(event: DropdownChangeEvent) {
    if (event.value) {
      this.city?.enable();
      this.store.dispatch(new GetCities(event.value));
    }
  }
  handleCityChange(event: DropdownChangeEvent) {
    if (event.value) {
      this.state?.enable();
      this.store.dispatch(new GetStates(event.value));
    }
  }

  handlecreationDateChange(value: Date) {
    if (value) {
      this.creationDateTo?.enable();
    }
  }
  handleLastModifiedDateChange(value: Date) {
    if (value) {
      this.lastModifiedDateTo?.enable();
    }
  }

  getMultiselectOverlayOptions(): OverlayOptions {
    return preventClosingPrimeOverlay();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
