import { TestBed } from '@angular/core/testing';

import { DetalleBonosService } from './detalle-bonos.service';

describe('DetalleBonosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetalleBonosService = TestBed.get(DetalleBonosService);
    expect(service).toBeTruthy();
  });
});
