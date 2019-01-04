import { TestBed } from '@angular/core/testing';

import { RolPagoService } from './rol-pago.service';

describe('RolPagoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RolPagoService = TestBed.get(RolPagoService);
    expect(service).toBeTruthy();
  });
});
