import { TestBed, inject } from '@angular/core/testing';

import { FormaCobroService } from './forma-cobro.service';

describe('FormaCobroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormaCobroService]
    });
  });

  it('should be created', inject([FormaCobroService], (service: FormaCobroService) => {
    expect(service).toBeTruthy();
  }));
});
