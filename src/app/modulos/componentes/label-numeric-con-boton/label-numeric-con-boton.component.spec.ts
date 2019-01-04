import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelNumericConBotonComponent } from './label-numeric-con-boton.component';

describe('LabelNumericConBotonComponent', () => {
  let component: LabelNumericConBotonComponent;
  let fixture: ComponentFixture<LabelNumericConBotonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelNumericConBotonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelNumericConBotonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
