import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinhosAdminComponent } from './vinhos-admin.component';

describe('VinhosAdminComponent', () => {
  let component: VinhosAdminComponent;
  let fixture: ComponentFixture<VinhosAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinhosAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinhosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
