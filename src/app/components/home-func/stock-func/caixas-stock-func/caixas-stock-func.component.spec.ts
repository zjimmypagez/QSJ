import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixasStockFuncComponent } from './caixas-stock-func.component';

describe('CaixasStockFuncComponent', () => {
  let component: CaixasStockFuncComponent;
  let fixture: ComponentFixture<CaixasStockFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaixasStockFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixasStockFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
