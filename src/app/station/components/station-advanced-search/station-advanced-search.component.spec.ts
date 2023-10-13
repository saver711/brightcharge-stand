import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdvancedSearchComponent } from './station-advanced-search.component';

describe('StationAdvancedSearchComponent', () => {
  let component: StationAdvancedSearchComponent;
  let fixture: ComponentFixture<StationAdvancedSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationAdvancedSearchComponent],
    });
    fixture = TestBed.createComponent(StationAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
