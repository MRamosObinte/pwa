import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoIngresosTabuladosComponent } from './consolidado-ingresos-tabulados.component';

describe('ConsolidadoIngresosTabuladosComponent', () => {
  let component: ConsolidadoIngresosTabuladosComponent;
  let fixture: ComponentFixture<ConsolidadoIngresosTabuladosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidadoIngresosTabuladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoIngresosTabuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
