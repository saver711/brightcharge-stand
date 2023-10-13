import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorsWrapperComponent } from './operators-wrapper.component';

describe('OperatorsWrapperComponent', () => {
  let component: OperatorsWrapperComponent;
  let fixture: ComponentFixture<OperatorsWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorsWrapperComponent],
    });
    fixture = TestBed.createComponent(OperatorsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
