import { TestBed, inject } from '@angular/core/testing';

import { VinhoServiceService } from './vinho-service.service';

describe('VinhoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VinhoServiceService]
    });
  });

  it('should be created', inject([VinhoServiceService], (service: VinhoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
