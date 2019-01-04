import { TestBed } from '@angular/core/testing';

import { CostosPiscinaSemanalService } from './costos-piscina-semanal.service';

describe('CostosPiscinaSemanalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostosPiscinaSemanalService = TestBed.get(CostosPiscinaSemanalService);
    expect(service).toBeTruthy();
  });
});
