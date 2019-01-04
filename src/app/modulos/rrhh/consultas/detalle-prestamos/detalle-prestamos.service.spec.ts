import { TestBed, inject } from '@angular/core/testing';

import { DetallePrestamosService } from './detalle-prestamos.service';

describe('DetallePrestamosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetallePrestamosService]
    });
  });

  it('should be created', inject([DetallePrestamosService], (service: DetallePrestamosService) => {
    expect(service).toBeTruthy();
  }));
});
