import { TestBed, inject } from '@angular/core/testing';

import { FormaPagoBeneficiosService } from './forma-pago-beneficios.service';

describe('FormaPagoBeneficiosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormaPagoBeneficiosService]
    });
  });

  it('should be created', inject([FormaPagoBeneficiosService], (service: FormaPagoBeneficiosService) => {
    expect(service).toBeTruthy();
  }));
});
