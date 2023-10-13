import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStationWorkingHoursComponent } from './create-station-working-hours.component';

describe('CreateStationWorkingHoursComponent', () => {
  let component: CreateStationWorkingHoursComponent;
  let fixture: ComponentFixture<CreateStationWorkingHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateStationWorkingHoursComponent],
    });
    fixture = TestBed.createComponent(CreateStationWorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
