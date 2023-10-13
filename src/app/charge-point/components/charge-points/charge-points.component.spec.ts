import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePointsComponent } from './charge-points.component';

describe('ChargePointsComponent', () => {
  let component: ChargePointsComponent;
  let fixture: ComponentFixture<ChargePointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargePointsComponent],
    });
    fixture = TestBed.createComponent(ChargePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
