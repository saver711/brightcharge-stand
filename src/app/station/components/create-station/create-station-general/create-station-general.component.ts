import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import {
  GetCities,
  GetCountries,
  GetStates,
} from '@station/state/station.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StationState } from '@station/state/station.state';
import { City, Country, State } from '@shared/models/location.model';
import { DropdownChangeEvent } from 'primeng/dropdown';
import Animation = google.maps.Animation;
import { accessType } from '@station/utils/constants';

@Component({
  selector: 'bs-create-station-general',
  templateUrl: './create-station-general.component.html',
  styleUrls: ['./create-station-general.component.scss'],
})
export class CreateStationGeneralComponent implements OnInit, OnDestroy {
  @Select(StationState.countries) countries$: Observable<Country[]> | undefined;
  @Select(StationState.cities) cities$: Observable<City[]> | undefined;
  @Select(StationState.states) states$: Observable<State[]> | undefined;

  private ngUnsubscribe = new Subject<void>();
  generalInfoGroup: FormGroup;
  countries: Country[] | undefined;
  cities: City[] | undefined;
  states: State[] | undefined;
  locationAccessTypes = accessType;

  center!: google.maps.LatLngLiteral;
  markerPosition!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.HYBRID,
    zoomControl: true,
    disableDoubleClickZoom: true,
    zoom: 12,
    maxZoom: 18,
    minZoom: 5,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: Animation.DROP,
  };

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.generalInfoGroup = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      locationAccessType: [null, [Validators.required]],
      country: [null, [Validators.required]],
      cityId: [{ value: null, disabled: true }, [Validators.required]],
      stateId: [{ value: null, disabled: true }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.store.dispatch(new GetCountries());
    this.countries$
      ?.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(countries => {
        this.countries = countries;
      });
    this.cities$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(cities => {
      this.cities = cities;
    });
    this.states$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(states => {
      this.states = states;
    });
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    if (!this.center) {
      this.center = {
        lat: 30.07640895966129,
        lng: 31.02529398003081,
      };
    }
    console.log(this.center);
  }

  get name() {
    return this.generalInfoGroup.get('name') as FormControl;
  }

  get address() {
    return this.generalInfoGroup.get('address') as FormControl;
  }

  get latitude() {
    return this.generalInfoGroup.get('latitude') as FormControl;
  }

  get longitude() {
    return this.generalInfoGroup.get('longitude') as FormControl;
  }

  get locationAccessType() {
    return this.generalInfoGroup.get('locationAccessType') as FormControl;
  }

  get country() {
    return this.generalInfoGroup.get('country') as FormControl;
  }

  get cityId() {
    return this.generalInfoGroup.get('cityId') as FormControl;
  }

  get stateId() {
    return this.generalInfoGroup.get('stateId') as FormControl;
  }

  handleCountryChange(event: DropdownChangeEvent) {
    if (event.value) {
      this.cityId.enable();
      this.store.dispatch(new GetCities(event.value));
    }
  }

  handleCityChange(event: DropdownChangeEvent) {
    if (event.value) {
      this.stateId.enable();
      this.store.dispatch(new GetStates(event.value));
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.latitude.patchValue(event.latLng?.lat());
      this.longitude.patchValue(event.latLng?.lng());
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
