import { TestBed, inject } from '@angular/core/testing';

import { ListadoConsumosService } from './listado-consumos.service';

describe('ListadoConsumosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoConsumosService]
    });
  });

  it('should be created', inject([ListadoConsumosService], (service: ListadoConsumosService) => {
    expect(service).toBeTruthy();
  }));
});
