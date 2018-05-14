import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirRemoverCaixaFuncComponent } from './inserir-remover-caixa-func.component';

describe('InserirRemoverCaixaAdminComponent', () => {
  let component: InserirRemoverCaixaFuncComponent;
  let fixture: ComponentFixture<InserirRemoverCaixaFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirRemoverCaixaFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirRemoverCaixaFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
