import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorWrapperComponent } from './operator-wrapper.component';

describe('OperatorWrapperComponent', () => {
  let component: OperatorWrapperComponent;
  let fixture: ComponentFixture<OperatorWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorWrapperComponent],
    });
    fixture = TestBed.createComponent(OperatorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
