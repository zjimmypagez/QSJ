import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGarrafasFuncComponent } from './editar-garrafas-func.component';

describe('EditarGarrafasFuncComponent', () => {
  let component: EditarGarrafasFuncComponent;
  let fixture: ComponentFixture<EditarGarrafasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarGarrafasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarGarrafasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
