import { TestBed, inject } from '@angular/core/testing';

import { ReconstruccionSaldosCostosService } from './reconstruccion-saldos-costos.service';

describe('ReconstruccionSaldosCostosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReconstruccionSaldosCostosService]
    });
  });

  it('should be created', inject([ReconstruccionSaldosCostosService], (service: ReconstruccionSaldosCostosService) => {
    expect(service).toBeTruthy();
  }));
});
