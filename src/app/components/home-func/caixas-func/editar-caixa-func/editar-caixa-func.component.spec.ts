import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCaixaFuncComponent } from './editar-caixa-func.component';

describe('EditarCaixaFuncComponent', () => {
  let component: EditarCaixaFuncComponent;
  let fixture: ComponentFixture<EditarCaixaFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCaixaFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCaixaFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
