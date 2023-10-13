import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperatorComponent } from './add-operator.component';

describe('AddOperatorComponent', () => {
  let component: AddOperatorComponent;
  let fixture: ComponentFixture<AddOperatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOperatorComponent],
    });
    fixture = TestBed.createComponent(AddOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
