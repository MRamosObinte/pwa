import { TestBed, inject } from '@angular/core/testing';

import { PlanContableService } from './plan-contable.service';

describe('PlanContableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanContableService]
    });
  });

  it('should be created', inject([PlanContableService], (service: PlanContableService) => {
    expect(service).toBeTruthy();
  }));
});
