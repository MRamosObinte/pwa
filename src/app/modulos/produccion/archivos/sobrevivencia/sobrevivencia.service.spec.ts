import { TestBed } from '@angular/core/testing';

import { SobrevivenciaService } from './sobrevivencia.service';

describe('SobrevivenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SobrevivenciaService = TestBed.get(SobrevivenciaService);
    expect(service).toBeTruthy();
  });
});
