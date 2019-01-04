import { TestBed, inject } from '@angular/core/testing';

import { MotivoBonosService } from './motivo-bonos.service';

describe('MotivoBonosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoBonosService]
    });
  });

  it('should be created', inject([MotivoBonosService], (service: MotivoBonosService) => {
    expect(service).toBeTruthy();
  }));
});
