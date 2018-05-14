import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirGarrafaAdminComponent } from './inserir-garrafa-admin.component';

describe('InserirGarrafaAdminComponent', () => {
  let component: InserirGarrafaAdminComponent;
  let fixture: ComponentFixture<InserirGarrafaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirGarrafaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirGarrafaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
