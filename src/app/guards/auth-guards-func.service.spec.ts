import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardsFuncService } from './auth-guards-func.service';

describe('AuthGuardsFuncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardsFuncService]
    });
  });

  it('should be created', inject([AuthGuardsFuncService], (service: AuthGuardsFuncService) => {
    expect(service).toBeTruthy();
  }));
});
