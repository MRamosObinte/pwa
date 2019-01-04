import { TestBed, inject } from '@angular/core/testing';

import { AppSistemaService } from './app-sistema.service';

describe('AppSistemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppSistemaService]
    });
  });

  it('should be created', inject([AppSistemaService], (service: AppSistemaService) => {
    expect(service).toBeTruthy();
  }));
});
