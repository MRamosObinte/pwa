import { TestBed, inject } from '@angular/core/testing';

import { KardexService } from './kardex.service';

describe('KardexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KardexService]
    });
  });

  it('should be created', inject([KardexService], (service: KardexService) => {
    expect(service).toBeTruthy();
  }));
});
