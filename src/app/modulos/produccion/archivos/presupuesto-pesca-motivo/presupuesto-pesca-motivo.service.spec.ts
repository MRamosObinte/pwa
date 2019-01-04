import { TestBed } from '@angular/core/testing';

import { PresupuestoPescaMotivoService } from './presupuesto-pesca-motivo.service';

describe('PresupuestoPescaMotivoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PresupuestoPescaMotivoService = TestBed.get(PresupuestoPescaMotivoService);
    expect(service).toBeTruthy();
  });
});
