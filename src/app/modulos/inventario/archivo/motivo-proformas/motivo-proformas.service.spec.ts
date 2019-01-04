import { TestBed, inject } from '@angular/core/testing';

import { MotivoProformasService } from './motivo-proformas.service';

describe('MotivoProformasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoProformasService]
    });
  });

  it('should be created', inject([MotivoProformasService], (service: MotivoProformasService) => {
    expect(service).toBeTruthy();
  }));
});
