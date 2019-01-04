import { TestBed, inject } from '@angular/core/testing';

import { RolPagosService } from './rol-pagos.service';

describe('RolPagosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RolPagosService]
    });
  });

  it('should be created', inject([RolPagosService], (service: RolPagosService) => {
    expect(service).toBeTruthy();
  }));
});
