import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChargePointSecurityComponent } from './create-charge-point-security.component';

describe('CreateChargePointSecurityComponent', () => {
  let component: CreateChargePointSecurityComponent;
  let fixture: ComponentFixture<CreateChargePointSecurityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChargePointSecurityComponent],
    });
    fixture = TestBed.createComponent(CreateChargePointSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
