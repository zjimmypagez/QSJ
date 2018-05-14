import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirVinhoAdminComponent } from './inserir-vinho-admin.component';

describe('InserirVinhoAdminComponent', () => {
  let component: InserirVinhoAdminComponent;
  let fixture: ComponentFixture<InserirVinhoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirVinhoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirVinhoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
