import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasConsolidadoProductosComponent } from './ventas-consolidado-productos.component';

describe('VentasConsolidadoProductosComponent', () => {
  let component: VentasConsolidadoProductosComponent;
  let fixture: ComponentFixture<VentasConsolidadoProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasConsolidadoProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasConsolidadoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
