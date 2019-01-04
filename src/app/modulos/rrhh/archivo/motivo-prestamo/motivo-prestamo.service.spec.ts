import { TestBed, inject } from '@angular/core/testing';

import { MotivoPrestamoService } from './motivo-prestamo.service';

describe('MotivoPrestamoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoPrestamoService]
    });
  });

  it('should be created', inject([MotivoPrestamoService], (service: MotivoPrestamoService) => {
    expect(service).toBeTruthy();
  }));
});
