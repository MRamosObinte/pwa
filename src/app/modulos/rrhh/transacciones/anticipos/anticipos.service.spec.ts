import { TestBed } from '@angular/core/testing';

import { AnticiposService } from './anticipos.service';

describe('AnticiposService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnticiposService = TestBed.get(AnticiposService);
    expect(service).toBeTruthy();
  });
});
