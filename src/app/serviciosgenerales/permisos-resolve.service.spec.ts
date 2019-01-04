import { TestBed, inject } from '@angular/core/testing';

import { PermisosResolveService } from './permisos-resolve.service';

describe('PermisosResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisosResolveService]
    });
  });

  it('should be created', inject([PermisosResolveService], (service: PermisosResolveService) => {
    expect(service).toBeTruthy();
  }));
});
