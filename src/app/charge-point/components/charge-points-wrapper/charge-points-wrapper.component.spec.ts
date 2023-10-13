import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePointsWrapperComponent } from './charge-points-wrapper.component';

describe('ChargePointsWrapperComponent', () => {
  let component: ChargePointsWrapperComponent;
  let fixture: ComponentFixture<ChargePointsWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargePointsWrapperComponent],
    });
    fixture = TestBed.createComponent(ChargePointsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
