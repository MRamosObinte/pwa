import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonAccionComponent } from './boton-accion.component';

describe('BotonAccionComponent', () => {
  let component: BotonAccionComponent;
  let fixture: ComponentFixture<BotonAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
