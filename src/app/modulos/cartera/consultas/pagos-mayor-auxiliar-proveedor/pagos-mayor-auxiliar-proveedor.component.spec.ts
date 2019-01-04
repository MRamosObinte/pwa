import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosMayorAuxiliarProveedorComponent } from './pagos-mayor-auxiliar-proveedor.component';

describe('PagosMayorAuxiliarProveedorComponent', () => {
  let component: PagosMayorAuxiliarProveedorComponent;
  let fixture: ComponentFixture<PagosMayorAuxiliarProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosMayorAuxiliarProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosMayorAuxiliarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
