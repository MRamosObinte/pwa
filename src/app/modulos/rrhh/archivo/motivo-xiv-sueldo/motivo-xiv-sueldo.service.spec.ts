import { TestBed, inject } from '@angular/core/testing';

import { MotivoXivSueldoService } from './motivo-xiv-sueldo.service';

describe('MotivoXivSueldoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoXivSueldoService]
    });
  });

  it('should be created', inject([MotivoXivSueldoService], (service: MotivoXivSueldoService) => {
    expect(service).toBeTruthy();
  }));
});
