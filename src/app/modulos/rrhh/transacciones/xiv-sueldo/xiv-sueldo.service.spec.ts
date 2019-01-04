import { TestBed } from '@angular/core/testing';

import { XivSueldoService } from './xiv-sueldo.service';

describe('XivSueldoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XivSueldoService = TestBed.get(XivSueldoService);
    expect(service).toBeTruthy();
  });
});
