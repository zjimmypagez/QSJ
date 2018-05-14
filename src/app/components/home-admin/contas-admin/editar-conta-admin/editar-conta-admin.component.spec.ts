import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarContaAdminComponent } from './editar-conta-admin.component';

describe('EditarContaAdminComponent', () => {
  let component: EditarContaAdminComponent;
  let fixture: ComponentFixture<EditarContaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarContaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarContaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
