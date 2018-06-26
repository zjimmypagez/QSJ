import { TestBed, inject } from '@angular/core/testing';

import { RecuperarService } from './recuperar.service';

describe('RecuperarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecuperarService]
    });
  });

  it('should be created', inject([RecuperarService], (service: RecuperarService) => {
    expect(service).toBeTruthy();
  }));
});
