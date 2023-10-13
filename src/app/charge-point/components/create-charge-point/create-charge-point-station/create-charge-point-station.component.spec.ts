import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargePointStationComponent } from './create-charge-point-station.component';

describe('CreateChargePointStationComponent', () => {
  let component: CreateChargePointStationComponent;
  let fixture: ComponentFixture<CreateChargePointStationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChargePointStationComponent],
    });
    fixture = TestBed.createComponent(CreateChargePointStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
