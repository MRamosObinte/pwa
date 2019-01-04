import { TestBed, inject } from '@angular/core/testing';

import { GrameajePiscinaProcesosService } from './grameaje-piscina-procesos.service';

describe('GrameajePiscinaProcesosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrameajePiscinaProcesosService]
    });
  });

  it('should be created', inject([GrameajePiscinaProcesosService], (service: GrameajePiscinaProcesosService) => {
    expect(service).toBeTruthy();
  }));
});
