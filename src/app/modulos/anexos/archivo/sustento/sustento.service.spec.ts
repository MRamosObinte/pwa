import { TestBed, inject } from '@angular/core/testing';

import { SustentoService } from './sustento.service';

describe('SustentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SustentoService]
    });
  });

  it('should be created', inject([SustentoService], (service: SustentoService) => {
    expect(service).toBeTruthy();
  }));
});
