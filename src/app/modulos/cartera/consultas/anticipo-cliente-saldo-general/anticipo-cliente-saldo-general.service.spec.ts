import { TestBed } from '@angular/core/testing';

import { AnticipoClienteSaldoGeneralService } from './anticipo-cliente-saldo-general.service';

describe('AnticipoClienteSaldoGeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnticipoClienteSaldoGeneralService = TestBed.get(AnticipoClienteSaldoGeneralService);
    expect(service).toBeTruthy();
  });
});
