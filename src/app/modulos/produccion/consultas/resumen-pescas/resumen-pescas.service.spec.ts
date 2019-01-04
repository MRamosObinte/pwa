import { TestBed, inject } from '@angular/core/testing';

import { ResumenPescasService } from './resumen-pescas.service';

describe('ResumenPescasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResumenPescasService]
    });
  });

  it('should be created', inject([ResumenPescasService], (service: ResumenPescasService) => {
    expect(service).toBeTruthy();
  }));
});
