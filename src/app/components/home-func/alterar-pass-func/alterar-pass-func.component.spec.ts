import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarPassFuncComponent } from './alterar-pass-func.component';

describe('AlterarPassFuncComponent', () => {
  let component: AlterarPassFuncComponent;
  let fixture: ComponentFixture<AlterarPassFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterarPassFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarPassFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
