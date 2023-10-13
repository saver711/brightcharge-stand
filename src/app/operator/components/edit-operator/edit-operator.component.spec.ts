import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperatorComponent } from './edit-operator.component';

describe('EditOperatorComponent', () => {
  let component: EditOperatorComponent;
  let fixture: ComponentFixture<EditOperatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOperatorComponent],
    });
    fixture = TestBed.createComponent(EditOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
