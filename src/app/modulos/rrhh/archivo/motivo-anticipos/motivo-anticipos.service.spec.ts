import { TestBed, inject } from '@angular/core/testing';

import { MotivoAnticiposService } from './motivo-anticipos.service';

describe('MotivoAnticiposService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoAnticiposService]
    });
  });

  it('should be created', inject([MotivoAnticiposService], (service: MotivoAnticiposService) => {
    expect(service).toBeTruthy();
  }));
});
