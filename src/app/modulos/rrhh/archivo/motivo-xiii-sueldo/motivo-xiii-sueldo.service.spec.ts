import { TestBed, inject } from '@angular/core/testing';

import { MotivoXiiiSueldoService } from './motivo-xiii-sueldo.service';

describe('MotivoXiiiSueldoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoXiiiSueldoService]
    });
  });

  it('should be created', inject([MotivoXiiiSueldoService], (service: MotivoXiiiSueldoService) => {
    expect(service).toBeTruthy();
  }));
});
