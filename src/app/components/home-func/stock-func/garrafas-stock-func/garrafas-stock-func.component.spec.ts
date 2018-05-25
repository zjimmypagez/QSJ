import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarrafasStockFuncComponent } from './garrafas-stock-func.component';

describe('GarrafasStockFuncComponent', () => {
  let component: GarrafasStockFuncComponent;
  let fixture: ComponentFixture<GarrafasStockFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarrafasStockFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarrafasStockFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
