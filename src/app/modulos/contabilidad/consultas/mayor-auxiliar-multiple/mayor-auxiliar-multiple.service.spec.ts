import { TestBed, inject } from '@angular/core/testing';

import { MayorAuxiliarMultipleService } from './mayor-auxiliar-multiple.service';

describe('MayorAuxiliarMultipleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MayorAuxiliarMultipleService]
    });
  });

  it('should be created', inject([MayorAuxiliarMultipleService], (service: MayorAuxiliarMultipleService) => {
    expect(service).toBeTruthy();
  }));
});
