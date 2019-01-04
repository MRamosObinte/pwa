import { TestBed, inject } from '@angular/core/testing';

import { ResumenSiembraService } from './resumen-siembra.service';

describe('ResumenSiembraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResumenSiembraService]
    });
  });

  it('should be created', inject([ResumenSiembraService], (service: ResumenSiembraService) => {
    expect(service).toBeTruthy();
  }));
});
