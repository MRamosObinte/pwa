import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoResultadoIntegralMensualizadoComponent } from './estado-resultado-integral-mensualizado.component';

describe('EstadoResultadoIntegralMensualizadoComponent', () => {
  let component: EstadoResultadoIntegralMensualizadoComponent;
  let fixture: ComponentFixture<EstadoResultadoIntegralMensualizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoResultadoIntegralMensualizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoResultadoIntegralMensualizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
