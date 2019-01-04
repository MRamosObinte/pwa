import { TestBed, inject } from '@angular/core/testing';

import { MayorGeneralService } from './mayor-general.service';

describe('MayorGeneralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MayorGeneralService]
    });
  });

  it('should be created', inject([MayorGeneralService], (service: MayorGeneralService) => {
    expect(service).toBeTruthy();
  }));
});
