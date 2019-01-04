import { TestBed, inject } from '@angular/core/testing';

import { FormaPagoService } from './forma-pago.service';

describe('FormaPagoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormaPagoService]
    });
  });

  it('should be created', inject([FormaPagoService], (service: FormaPagoService) => {
    expect(service).toBeTruthy();
  }));
});
