import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirEncomendaFuncComponent } from './inserir-encomenda-func.component';

describe('InserirEncomendaFuncComponent', () => {
  let component: InserirEncomendaFuncComponent;
  let fixture: ComponentFixture<InserirEncomendaFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirEncomendaFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirEncomendaFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
