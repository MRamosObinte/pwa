import { TestBed, inject } from '@angular/core/testing';

import { ListadoChequesCobrarService } from './listado-cheques-cobrar.service';

describe('ListadoChequesCobrarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoChequesCobrarService]
    });
  });

  it('should be created', inject([ListadoChequesCobrarService], (service: ListadoChequesCobrarService) => {
    expect(service).toBeTruthy();
  }));
});
