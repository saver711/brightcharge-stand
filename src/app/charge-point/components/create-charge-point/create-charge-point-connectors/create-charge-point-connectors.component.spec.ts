import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateChargePointConnectorsComponent } from './create-charge-point-connectors.component';

describe('CreateChargePointConnectorsComponent', () => {
  let component: CreateChargePointConnectorsComponent;
  let fixture: ComponentFixture<CreateChargePointConnectorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChargePointConnectorsComponent],
    });
    fixture = TestBed.createComponent(CreateChargePointConnectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
