import { TestBed } from '@angular/core/testing';

import { OperatorMediaConversionService } from './operator-media-conversion.service';

describe('OperatorMediaConversionService', () => {
  let service: OperatorMediaConversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorMediaConversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
