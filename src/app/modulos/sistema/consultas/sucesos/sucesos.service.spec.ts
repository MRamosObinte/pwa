import { TestBed, inject } from '@angular/core/testing';

import { SucesosService } from './sucesos.service';

describe('SucesosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SucesosService]
    });
  });

  it('should be created', inject([SucesosService], (service: SucesosService) => {
    expect(service).toBeTruthy();
  }));
});
