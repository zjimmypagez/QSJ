import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirContaAdminComponent } from './inserir-conta-admin.component';

describe('InserirContaAdminComponent', () => {
  let component: InserirContaAdminComponent;
  let fixture: ComponentFixture<InserirContaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirContaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirContaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
