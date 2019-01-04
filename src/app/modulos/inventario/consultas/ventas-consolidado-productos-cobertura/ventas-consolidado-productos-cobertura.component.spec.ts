import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasConsolidadoProductosCoberturaComponent } from './ventas-consolidado-productos-cobertura.component';

describe('VentasConsolidadoProductosCoberturaComponent', () => {
  let component: VentasConsolidadoProductosCoberturaComponent;
  let fixture: ComponentFixture<VentasConsolidadoProductosCoberturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasConsolidadoProductosCoberturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasConsolidadoProductosCoberturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
