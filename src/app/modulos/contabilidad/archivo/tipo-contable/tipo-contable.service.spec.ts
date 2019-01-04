import { TestBed, inject } from '@angular/core/testing';

import { TipoContableService } from './tipo-contable.service';

describe('TipoContableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoContableService]
    });
  });

  it('should be created', inject([TipoContableService], (service: TipoContableService) => {
    expect(service).toBeTruthy();
  }));
});
