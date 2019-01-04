import { TestBed, inject } from '@angular/core/testing';

import { MotivoTransferenciasService } from './motivo-transferencias.service';

describe('MotivoTransferenciasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoTransferenciasService]
    });
  });

  it('should be created', inject([MotivoTransferenciasService], (service: MotivoTransferenciasService) => {
    expect(service).toBeTruthy();
  }));
});
