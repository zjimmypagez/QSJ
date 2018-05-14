import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarrafasAdminComponent } from './garrafas-admin.component';

describe('GarrafasAdminComponent', () => {
  let component: GarrafasAdminComponent;
  let fixture: ComponentFixture<GarrafasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarrafasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarrafasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
