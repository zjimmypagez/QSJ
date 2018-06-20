import { TestBed, inject } from '@angular/core/testing';

import { GarrafaServiceService } from './garrafa-service.service';

describe('GarrafaServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GarrafaServiceService]
    });
  });

  it('should be created', inject([GarrafaServiceService], (service: GarrafaServiceService) => {
    expect(service).toBeTruthy();
  }));
});
