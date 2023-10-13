import { TestBed } from '@angular/core/testing';

import { OperatorResolverService } from './operator-resolver.service';

describe('OperatorResolverService', () => {
  let service: OperatorResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatorResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
