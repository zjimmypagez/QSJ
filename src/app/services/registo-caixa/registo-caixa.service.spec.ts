import { TestBed, inject } from '@angular/core/testing';

import { RegistoCaixaService } from './registo-caixa.service';

describe('RegistoCaixaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistoCaixaService]
    });
  });

  it('should be created', inject([RegistoCaixaService], (service: RegistoCaixaService) => {
    expect(service).toBeTruthy();
  }));
});
