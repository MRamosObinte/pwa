import { TestBed, inject } from '@angular/core/testing';

import { MotivoRolPagoService } from './motivo-rol-pago.service';

describe('MotivoRolPagoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoRolPagoService]
    });
  });

  it('should be created', inject([MotivoRolPagoService], (service: MotivoRolPagoService) => {
    expect(service).toBeTruthy();
  }));
});
