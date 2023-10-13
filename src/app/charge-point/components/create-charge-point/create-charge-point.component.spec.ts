import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargePointComponent } from './create-charge-point.component';

describe('CreateChargePointComponent', () => {
  let component: CreateChargePointComponent;
  let fixture: ComponentFixture<CreateChargePointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChargePointComponent],
    });
    fixture = TestBed.createComponent(CreateChargePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
