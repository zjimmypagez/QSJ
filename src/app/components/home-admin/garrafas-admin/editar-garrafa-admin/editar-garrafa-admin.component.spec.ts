import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGarrafaAdminComponent } from './editar-garrafa-admin.component';

describe('EditarGarrafaAdminComponent', () => {
  let component: EditarGarrafaAdminComponent;
  let fixture: ComponentFixture<EditarGarrafaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarGarrafaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarGarrafaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
