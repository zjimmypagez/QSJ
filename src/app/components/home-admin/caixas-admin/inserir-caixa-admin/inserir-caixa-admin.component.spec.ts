import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirCaixaAdminComponent } from './inserir-caixa-admin.component';

describe('InserirCaixaAdminComponent', () => {
  let component: InserirCaixaAdminComponent;
  let fixture: ComponentFixture<InserirCaixaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirCaixaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirCaixaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
