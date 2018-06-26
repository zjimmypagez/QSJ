import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardsAdminService } from './auth-guards-admin.service';

describe('AuthGuardsAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardsAdminService]
    });
  });

  it('should be created', inject([AuthGuardsAdminService], (service: AuthGuardsAdminService) => {
    expect(service).toBeTruthy();
  }));
});
