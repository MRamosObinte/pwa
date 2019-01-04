import { TestBed } from '@angular/core/testing';

import { XiiiSueldoService } from './xiii-sueldo.service';

describe('XiiiSueldoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XiiiSueldoService = TestBed.get(XiiiSueldoService);
    expect(service).toBeTruthy();
  });
});
