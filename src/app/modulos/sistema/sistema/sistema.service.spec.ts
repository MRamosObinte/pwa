import { TestBed, inject } from '@angular/core/testing';

import { SistemaService } from './sistema.service';

describe('SistemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SistemaService]
    });
  });

  it('should be created', inject([SistemaService], (service: SistemaService) => {
    expect(service).toBeTruthy();
  }));
});
