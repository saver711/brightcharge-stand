import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePointAdvancedSearchComponent } from './charge-point-advanced-search.component';

describe('ChargePointAdvancedSearchComponent', () => {
  let component: ChargePointAdvancedSearchComponent;
  let fixture: ComponentFixture<ChargePointAdvancedSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChargePointAdvancedSearchComponent],
    });
    fixture = TestBed.createComponent(ChargePointAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
