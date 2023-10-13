import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperatorSubscriptionComponent } from './edit-operator-subscription.component';

describe('EditOperatorSubscriptionComponent', () => {
  let component: EditOperatorSubscriptionComponent;
  let fixture: ComponentFixture<EditOperatorSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOperatorSubscriptionComponent],
    });
    fixture = TestBed.createComponent(EditOperatorSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
