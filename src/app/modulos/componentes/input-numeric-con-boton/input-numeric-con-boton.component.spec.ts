import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumericConBotonComponent } from './input-numeric-con-boton.component';

describe('InputNumericConBotonComponent', () => {
  let component: InputNumericConBotonComponent;
  let fixture: ComponentFixture<InputNumericConBotonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputNumericConBotonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumericConBotonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
