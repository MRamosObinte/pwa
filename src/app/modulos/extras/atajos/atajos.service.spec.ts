import { TestBed } from '@angular/core/testing';

import { AtajosService } from './atajos.service';

describe('AtajosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtajosService = TestBed.get(AtajosService);
    expect(service).toBeTruthy();
  });
});
