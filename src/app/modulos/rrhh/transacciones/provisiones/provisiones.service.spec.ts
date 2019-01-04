import { TestBed } from '@angular/core/testing';

import { ProvisionesService } from './provisiones.service';

describe('ProvisionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvisionesService = TestBed.get(ProvisionesService);
    expect(service).toBeTruthy();
  });
});
