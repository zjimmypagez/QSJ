import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarVinhoAdminComponent } from './editar-vinho-admin.component';

describe('EditarVinhoAdminComponent', () => {
  let component: EditarVinhoAdminComponent;
  let fixture: ComponentFixture<EditarVinhoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarVinhoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarVinhoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
