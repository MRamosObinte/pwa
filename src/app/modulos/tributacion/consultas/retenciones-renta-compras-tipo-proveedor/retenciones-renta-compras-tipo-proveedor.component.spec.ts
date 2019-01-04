import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesRentaComprasTipoProveedorComponent } from './retenciones-renta-compras-tipo-proveedor.component';

describe('RetencionesRentaComprasTipoProveedorComponent', () => {
  let component: RetencionesRentaComprasTipoProveedorComponent;
  let fixture: ComponentFixture<RetencionesRentaComprasTipoProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesRentaComprasTipoProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesRentaComprasTipoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
