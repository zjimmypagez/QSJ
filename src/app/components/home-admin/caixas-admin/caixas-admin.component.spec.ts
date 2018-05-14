import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixasAdminComponent } from './caixas-admin.component';

describe('CaixasAdminComponent', () => {
  let component: CaixasAdminComponent;
  let fixture: ComponentFixture<CaixasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaixasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
