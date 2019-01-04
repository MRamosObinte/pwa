import { TestBed, inject } from '@angular/core/testing';

import { MotivoDepreciacionService } from './motivo-depreciacion.service';

describe('MotivoDepreciacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoDepreciacionService]
    });
  });

  it('should be created', inject([MotivoDepreciacionService], (service: MotivoDepreciacionService) => {
    expect(service).toBeTruthy();
  }));
});
