import { TestBed } from '@angular/core/testing';

import { CobroService } from './cobro.service';

describe('CobroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobroService = TestBed.get(CobroService);
    expect(service).toBeTruthy();
  });
});
