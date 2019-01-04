import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasConsolidadoClientesComponent } from './ventas-consolidado-clientes.component';

describe('VentasConsolidadoClientesComponent', () => {
  let component: VentasConsolidadoClientesComponent;
  let fixture: ComponentFixture<VentasConsolidadoClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasConsolidadoClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasConsolidadoClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
