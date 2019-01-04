import { TestBed, inject } from '@angular/core/testing';

import { ProductoPresentacionCajasService } from './producto-presentacion-cajas.service';

describe('ProductoPresentacionCajasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoPresentacionCajasService]
    });
  });

  it('should be created', inject([ProductoPresentacionCajasService], (service: ProductoPresentacionCajasService) => {
    expect(service).toBeTruthy();
  }));
});
