import { TestBed, inject } from '@angular/core/testing';

import { CantonService } from './canton.service';

describe('CantonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CantonService]
    });
  });

  it('should be created', inject([CantonService], (service: CantonService) => {
    expect(service).toBeTruthy();
  }));
});
