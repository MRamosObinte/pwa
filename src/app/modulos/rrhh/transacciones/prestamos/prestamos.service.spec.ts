import { TestBed } from '@angular/core/testing';

import { PrestamosService } from './prestamos.service';

describe('PrestamosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrestamosService = TestBed.get(PrestamosService);
    expect(service).toBeTruthy();
  });
});
