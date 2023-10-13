import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsWrapperComponent } from './stations-wrapper.component';

describe('StationsWrapperComponent', () => {
  let component: StationsWrapperComponent;
  let fixture: ComponentFixture<StationsWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationsWrapperComponent],
    });
    fixture = TestBed.createComponent(StationsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
