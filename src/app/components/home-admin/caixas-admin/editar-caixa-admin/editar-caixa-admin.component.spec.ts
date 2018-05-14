import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCaixaAdminComponent } from './editar-caixa-admin.component';

describe('EditarCaixaAdminComponent', () => {
  let component: EditarCaixaAdminComponent;
  let fixture: ComponentFixture<EditarCaixaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCaixaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCaixaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
