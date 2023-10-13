import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorAdvancedSearchComponent } from './operator-advanced-search.component';

describe('OperatorAdvancedSearchComponent', () => {
  let component: OperatorAdvancedSearchComponent;
  let fixture: ComponentFixture<OperatorAdvancedSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorAdvancedSearchComponent],
    });
    fixture = TestBed.createComponent(OperatorAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
