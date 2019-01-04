import { TestBed } from '@angular/core/testing';

import { BonosService } from './bonos.service';

describe('BonosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BonosService = TestBed.get(BonosService);
    expect(service).toBeTruthy();
  });
});
