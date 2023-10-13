import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStationAmenitiesComponent } from './create-station-amenities.component';

describe('CreateStationAmenitiesComponent', () => {
  let component: CreateStationAmenitiesComponent;
  let fixture: ComponentFixture<CreateStationAmenitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateStationAmenitiesComponent],
    });
    fixture = TestBed.createComponent(CreateStationAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
