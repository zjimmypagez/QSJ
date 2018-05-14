import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarrafasFuncComponent } from './garrafas-func.component';

describe('GarrafasFuncComponent', () => {
  let component: GarrafasFuncComponent;
  let fixture: ComponentFixture<GarrafasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarrafasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarrafasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
