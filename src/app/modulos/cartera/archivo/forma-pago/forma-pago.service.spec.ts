import { TestBed } from '@angular/core/testing';

import { FormaPagoService } from './forma-pago.service';

describe('FormaPagoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormaPagoService = TestBed.get(FormaPagoService);
    expect(service).toBeTruthy();
  });
});
