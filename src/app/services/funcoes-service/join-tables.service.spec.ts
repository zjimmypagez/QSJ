import { TestBed, inject } from '@angular/core/testing';

import { JoinTablesService } from './join-tables.service';

describe('JoinTablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JoinTablesService]
    });
  });

  it('should be created', inject([JoinTablesService], (service: JoinTablesService) => {
    expect(service).toBeTruthy();
  }));
});
