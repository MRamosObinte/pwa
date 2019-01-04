import { TestBed, inject } from '@angular/core/testing';

import { TablaNavegacionService } from './tabla-navegacion.service';

describe('TablaNavegacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablaNavegacionService]
    });
  });

  it('should be created', inject([TablaNavegacionService], (service: TablaNavegacionService) => {
    expect(service).toBeTruthy();
  }));
});
