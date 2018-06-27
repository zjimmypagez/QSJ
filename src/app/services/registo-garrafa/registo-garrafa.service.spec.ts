import { TestBed, inject } from '@angular/core/testing';

import { RegistoGarrafaService } from './registo-garrafa.service';

describe('RegistoGarrafaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistoGarrafaService]
    });
  });

  it('should be created', inject([RegistoGarrafaService], (service: RegistoGarrafaService) => {
    expect(service).toBeTruthy();
  }));
});
