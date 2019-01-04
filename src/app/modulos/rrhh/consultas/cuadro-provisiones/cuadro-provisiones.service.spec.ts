import { TestBed, inject } from '@angular/core/testing';

import { CuadroProvisionesService } from './cuadro-provisiones.service';

describe('CuadroProvisionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuadroProvisionesService]
    });
  });

  it('should be created', inject([CuadroProvisionesService], (service: CuadroProvisionesService) => {
    expect(service).toBeTruthy();
  }));
});
