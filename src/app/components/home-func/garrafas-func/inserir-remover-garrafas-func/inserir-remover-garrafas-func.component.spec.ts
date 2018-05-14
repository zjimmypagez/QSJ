import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirRemoverGarrafasFuncComponent } from './inserir-remover-garrafas-func.component';

describe('InserirRemoverGarrafasFuncComponent', () => {
  let component: InserirRemoverGarrafasFuncComponent;
  let fixture: ComponentFixture<InserirRemoverGarrafasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserirRemoverGarrafasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirRemoverGarrafasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
