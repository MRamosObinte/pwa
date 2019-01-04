import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonOpcionesComponent } from './boton-opciones.component';

describe('BotonOpcionesComponent', () => {
  let component: BotonOpcionesComponent;
  let fixture: ComponentFixture<BotonOpcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonOpcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
