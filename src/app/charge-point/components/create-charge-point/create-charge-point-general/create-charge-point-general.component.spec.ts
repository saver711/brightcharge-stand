import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateChargePointGeneralComponent } from './create-station-general.component';

describe('CreateChargePointGeneralComponent', () => {
  let component: CreateChargePointGeneralComponent;
  let fixture: ComponentFixture<CreateChargePointGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChargePointGeneralComponent],
    });
    fixture = TestBed.createComponent(CreateChargePointGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
