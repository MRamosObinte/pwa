import { TestBed } from '@angular/core/testing';

import { FormaCobroService } from './forma-cobro.service';

describe('FormaCobroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormaCobroService = TestBed.get(FormaCobroService);
    expect(service).toBeTruthy();
  });
});
