import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOperatorSubscriptionComponent } from './new-operator-subscription.component';

describe('NewOperatorSubscriptionComponent', () => {
  let component: NewOperatorSubscriptionComponent;
  let fixture: ComponentFixture<NewOperatorSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewOperatorSubscriptionComponent],
    });
    fixture = TestBed.createComponent(NewOperatorSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
