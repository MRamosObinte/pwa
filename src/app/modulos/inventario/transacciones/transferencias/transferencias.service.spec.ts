import { TestBed, inject } from '@angular/core/testing';

import { TransferenciasService } from './transferencias.service';

describe('TransferenciasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferenciasService]
    });
  });

  it('should be created', inject([TransferenciasService], (service: TransferenciasService) => {
    expect(service).toBeTruthy();
  }));
});
