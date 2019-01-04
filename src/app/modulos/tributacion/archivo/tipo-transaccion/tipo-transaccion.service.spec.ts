import { TestBed, inject } from '@angular/core/testing';

import { TipoTransaccionService } from './tipo-transaccion.service';

describe('TipoTransaccionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoTransaccionService]
    });
  });

  it('should be created', inject([TipoTransaccionService], (service: TipoTransaccionService) => {
    expect(service).toBeTruthy();
  }));
});
