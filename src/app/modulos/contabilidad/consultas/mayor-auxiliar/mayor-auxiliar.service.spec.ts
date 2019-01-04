import { TestBed, inject } from '@angular/core/testing';

import { MayorAuxiliarService } from './mayor-auxiliar.service';

describe('MayorAuxiliarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MayorAuxiliarService]
    });
  });

  it('should be created', inject([MayorAuxiliarService], (service: MayorAuxiliarService) => {
    expect(service).toBeTruthy();
  }));
});
