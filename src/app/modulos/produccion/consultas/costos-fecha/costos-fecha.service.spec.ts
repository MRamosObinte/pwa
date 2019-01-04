import { TestBed, inject } from '@angular/core/testing';

import { CostosFechaService } from './costos-fecha.service';

describe('CostosFechaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostosFechaService]
    });
  });

  it('should be created', inject([CostosFechaService], (service: CostosFechaService) => {
    expect(service).toBeTruthy();
  }));
});
