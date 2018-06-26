import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardsHomeService } from './auth-guards-home.service';

describe('AuthGuardsHomeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardsHomeService]
    });
  });

  it('should be created', inject([AuthGuardsHomeService], (service: AuthGuardsHomeService) => {
    expect(service).toBeTruthy();
  }));
});
