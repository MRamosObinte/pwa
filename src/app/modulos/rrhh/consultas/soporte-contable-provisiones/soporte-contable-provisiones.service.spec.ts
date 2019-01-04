import { TestBed, inject } from '@angular/core/testing';

import { SoporteContableProvisionesService } from './soporte-contable-provisiones.service';

describe('SoporteContableProvisionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoporteContableProvisionesService]
    });
  });

  it('should be created', inject([SoporteContableProvisionesService], (service: SoporteContableProvisionesService) => {
    expect(service).toBeTruthy();
  }));
});
