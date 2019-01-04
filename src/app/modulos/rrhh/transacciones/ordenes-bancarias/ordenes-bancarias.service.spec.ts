import { TestBed } from '@angular/core/testing';

import { OrdenesBancariasService } from './ordenes-bancarias.service';

describe('OrdenesBancariasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdenesBancariasService = TestBed.get(OrdenesBancariasService);
    expect(service).toBeTruthy();
  });
});
