import { TestBed, inject } from '@angular/core/testing';

import { DetalleAnticiposService } from './detalle-anticipos.service';

describe('DetalleAnticiposService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetalleAnticiposService]
    });
  });

  it('should be created', inject([DetalleAnticiposService], (service: DetalleAnticiposService) => {
    expect(service).toBeTruthy();
  }));
});
