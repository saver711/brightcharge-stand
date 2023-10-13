import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationToastComponent } from './confirmation-toast.component';

describe('ConfirmationToastComponent', () => {
  let component: ConfirmationToastComponent;
  let fixture: ComponentFixture<ConfirmationToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationToastComponent],
    });
    fixture = TestBed.createComponent(ConfirmationToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
