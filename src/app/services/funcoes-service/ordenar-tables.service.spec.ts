import { TestBed, inject } from '@angular/core/testing';

import { OrdenarTablesService } from './ordenar-tables.service';

describe('OrdenarTablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenarTablesService]
    });
  });

  it('should be created', inject([OrdenarTablesService], (service: OrdenarTablesService) => {
    expect(service).toBeTruthy();
  }));
});
