import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixasFuncComponent } from './caixas-func.component';

describe('CaixasFuncComponent', () => {
  let component: CaixasFuncComponent;
  let fixture: ComponentFixture<CaixasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaixasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
