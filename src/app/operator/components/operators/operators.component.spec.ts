import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorsComponent } from './operators.component';

describe('OperatorsComponent', () => {
  let component: OperatorsComponent;
  let fixture: ComponentFixture<OperatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorsComponent],
    });
    fixture = TestBed.createComponent(OperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
