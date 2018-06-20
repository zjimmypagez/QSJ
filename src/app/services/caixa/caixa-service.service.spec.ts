import { TestBed, inject } from '@angular/core/testing';

import { CaixaServiceService } from './caixa-service.service';

describe('CaixaServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaixaServiceService]
    });
  });

  it('should be created', inject([CaixaServiceService], (service: CaixaServiceService) => {
    expect(service).toBeTruthy();
  }));
});
