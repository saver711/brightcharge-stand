import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOperatorLegalComponent } from './new-operator-legal.component';

describe('NewOperatorLegalComponent', () => {
  let component: NewOperatorLegalComponent;
  let fixture: ComponentFixture<NewOperatorLegalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewOperatorLegalComponent],
    });
    fixture = TestBed.createComponent(NewOperatorLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
