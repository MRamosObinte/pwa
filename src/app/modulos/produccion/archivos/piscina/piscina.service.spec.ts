import { TestBed, inject } from '@angular/core/testing';

import { PiscinaService } from './piscina.service';

describe('PiscinaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PiscinaService]
    });
  });

  it('should be created', inject([PiscinaService], (service: PiscinaService) => {
    expect(service).toBeTruthy();
  }));
});
