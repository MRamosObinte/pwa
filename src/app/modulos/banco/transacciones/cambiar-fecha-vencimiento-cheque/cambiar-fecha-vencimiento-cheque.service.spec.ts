import { TestBed, inject } from '@angular/core/testing';

import { CambiarFechaVencimientoChequeService } from './cambiar-fecha-vencimiento-cheque.service';

describe('CambiarFechaVencimientoChequeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambiarFechaVencimientoChequeService]
    });
  });

  it('should be created', inject([CambiarFechaVencimientoChequeService], (service: CambiarFechaVencimientoChequeService) => {
    expect(service).toBeTruthy();
  }));
});
