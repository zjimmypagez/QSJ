import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasAdminComponent } from './contas-admin.component';

describe('ContasAdminComponent', () => {
  let component: ContasAdminComponent;
  let fixture: ComponentFixture<ContasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
