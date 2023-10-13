import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperatorGeneralComponent } from './edit-operator-general.component';

describe('EditOperatorGeneralComponent', () => {
  let component: EditOperatorGeneralComponent;
  let fixture: ComponentFixture<EditOperatorGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOperatorGeneralComponent],
    });
    fixture = TestBed.createComponent(EditOperatorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
