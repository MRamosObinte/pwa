import { TestBed } from '@angular/core/testing';

import { ChequesPostfechadosService } from './cheques-postfechados.service';

describe('ChequesPostfechadosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChequesPostfechadosService = TestBed.get(ChequesPostfechadosService);
    expect(service).toBeTruthy();
  });
});
