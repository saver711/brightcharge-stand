import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOperatorGeneralComponent } from './new-operator-general.component';

describe('NewOperatorGeneralComponent', () => {
  let component: NewOperatorGeneralComponent;
  let fixture: ComponentFixture<NewOperatorGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewOperatorGeneralComponent],
    });
    fixture = TestBed.createComponent(NewOperatorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
