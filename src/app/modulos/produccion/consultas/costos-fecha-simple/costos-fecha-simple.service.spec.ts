import { TestBed, inject } from '@angular/core/testing';

import { CostosFechaSimpleService } from './costos-fecha-simple.service';

describe('CostosFechaSimpleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostosFechaSimpleService]
    });
  });

  it('should be created', inject([CostosFechaSimpleService], (service: CostosFechaSimpleService) => {
    expect(service).toBeTruthy();
  }));
});
