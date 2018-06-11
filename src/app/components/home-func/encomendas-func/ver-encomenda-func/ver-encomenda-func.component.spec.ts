import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEncomendaFuncComponent } from './ver-encomenda-func.component';

describe('VerEncomendaFuncComponent', () => {
  let component: VerEncomendaFuncComponent;
  let fixture: ComponentFixture<VerEncomendaFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEncomendaFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEncomendaFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
