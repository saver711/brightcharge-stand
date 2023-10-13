import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousUserSectionComponent } from './anonymous-user-section.component';

describe('AnonymousUserSectionComponent', () => {
  let component: AnonymousUserSectionComponent;
  let fixture: ComponentFixture<AnonymousUserSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousUserSectionComponent],
    });
    fixture = TestBed.createComponent(AnonymousUserSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
