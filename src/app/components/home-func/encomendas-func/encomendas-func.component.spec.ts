import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendasFuncComponent } from './encomendas-func.component';

describe('EncomendasFuncComponent', () => {
  let component: EncomendasFuncComponent;
  let fixture: ComponentFixture<EncomendasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
