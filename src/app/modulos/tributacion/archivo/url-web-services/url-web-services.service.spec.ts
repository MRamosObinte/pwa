import { TestBed, inject } from '@angular/core/testing';

import { UrlWebServicesService } from './url-web-services.service';

describe('UrlWebServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlWebServicesService]
    });
  });

  it('should be created', inject([UrlWebServicesService], (service: UrlWebServicesService) => {
    expect(service).toBeTruthy();
  }));
});
