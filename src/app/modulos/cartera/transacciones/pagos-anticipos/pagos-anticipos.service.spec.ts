import { TestBed } from '@angular/core/testing';

import { PagosAnticiposService } from './pagos-anticipos.service';

describe('PagosAnticiposService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagosAnticiposService = TestBed.get(PagosAnticiposService);
    expect(service).toBeTruthy();
  });
});
