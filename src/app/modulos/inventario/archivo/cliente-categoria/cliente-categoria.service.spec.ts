import { TestBed, inject } from '@angular/core/testing';

import { ClienteCategoriaService } from './cliente-categoria.service';

describe('ClienteCategoriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClienteCategoriaService]
    });
  });

  it('should be created', inject([ClienteCategoriaService], (service: ClienteCategoriaService) => {
    expect(service).toBeTruthy();
  }));
});
