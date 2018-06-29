import { TestBed, inject } from '@angular/core/testing';

import { EncomendaService } from './encomenda.service';

describe('EncomendaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncomendaService]
    });
  });

  it('should be created', inject([EncomendaService], (service: EncomendaService) => {
    expect(service).toBeTruthy();
  }));
});
