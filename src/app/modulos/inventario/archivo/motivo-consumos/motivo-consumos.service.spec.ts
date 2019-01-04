import { TestBed, inject } from '@angular/core/testing';

import { MotivoConsumosService } from './motivo-consumos.service';

describe('MotivoConsumosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoConsumosService]
    });
  });

  it('should be created', inject([MotivoConsumosService], (service: MotivoConsumosService) => {
    expect(service).toBeTruthy();
  }));
});
