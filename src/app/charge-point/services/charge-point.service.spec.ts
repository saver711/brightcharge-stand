import { TestBed } from '@angular/core/testing';

import { ChargePointService } from './charge-point.service';

describe('ChargePointService', () => {
  let service: ChargePointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargePointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
