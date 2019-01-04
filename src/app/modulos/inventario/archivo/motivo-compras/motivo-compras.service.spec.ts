import { TestBed, inject } from '@angular/core/testing';

import { MotivoComprasService } from './motivo-compras.service';

describe('MotivoComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoComprasService]
    });
  });

  it('should be created', inject([MotivoComprasService], (service: MotivoComprasService) => {
    expect(service).toBeTruthy();
  }));
});
