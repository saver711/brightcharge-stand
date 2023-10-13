import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperatorLegalComponent } from './edit-operator-legal.component';

describe('EditOperatorLegalComponent', () => {
  let component: EditOperatorLegalComponent;
  let fixture: ComponentFixture<EditOperatorLegalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOperatorLegalComponent],
    });
    fixture = TestBed.createComponent(EditOperatorLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
