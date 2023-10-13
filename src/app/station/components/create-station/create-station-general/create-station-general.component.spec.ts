import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStationGeneralComponent } from './create-station-general.component';

describe('CreateStationGeneralComponent', () => {
  let component: CreateStationGeneralComponent;
  let fixture: ComponentFixture<CreateStationGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateStationGeneralComponent],
    });
    fixture = TestBed.createComponent(CreateStationGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
