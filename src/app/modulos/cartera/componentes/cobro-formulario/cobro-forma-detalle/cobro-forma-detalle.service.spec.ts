import { TestBed } from '@angular/core/testing';

import { CobroFormaDetalleService } from './cobro-forma-detalle.service';

describe('CobroFormaDetalleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobroFormaDetalleService = TestBed.get(CobroFormaDetalleService);
    expect(service).toBeTruthy();
  });
});
