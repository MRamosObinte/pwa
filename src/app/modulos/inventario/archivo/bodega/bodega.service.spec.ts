import { TestBed, inject } from '@angular/core/testing';

import { BodegaService } from './bodega.service';

describe('BodegaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BodegaService]
    });
  });

  it('should be created', inject([BodegaService], (service: BodegaService) => {
    expect(service).toBeTruthy();
  }));
});
