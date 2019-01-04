import { TestBed, inject } from '@angular/core/testing';

import { CorridaService } from './corrida.service';

describe('CorridaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorridaService]
    });
  });

  it('should be created', inject([CorridaService], (service: CorridaService) => {
    expect(service).toBeTruthy();
  }));
});
