import { TestBed } from '@angular/core/testing';

import { CobrosAnticiposService } from './cobros-anticipos.service';

describe('CobrosAnticiposService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobrosAnticiposService = TestBed.get(CobrosAnticiposService);
    expect(service).toBeTruthy();
  });
});
