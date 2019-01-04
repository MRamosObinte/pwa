import { TestBed, inject } from '@angular/core/testing';

import { MotivoVentasService } from './motivo-ventas.service';

describe('MotivoVentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoVentasService]
    });
  });

  it('should be created', inject([MotivoVentasService], (service: MotivoVentasService) => {
    expect(service).toBeTruthy();
  }));
});
