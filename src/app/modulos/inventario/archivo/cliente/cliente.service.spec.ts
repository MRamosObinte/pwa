import { TestBed, inject } from '@angular/core/testing';

import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClienteService]
    });
  });

  it('should be created', inject([ClienteService], (service: ClienteService) => {
    expect(service).toBeTruthy();
  }));
});
