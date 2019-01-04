import { TestBed, inject } from '@angular/core/testing';

import { CuentaService } from './cuenta.service';

describe('CuentaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuentaService]
    });
  });

  it('should be created', inject([CuentaService], (service: CuentaService) => {
    expect(service).toBeTruthy();
  }));
});
