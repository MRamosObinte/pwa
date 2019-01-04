import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDevolucionIvaVentasComponent } from './listado-devolucion-iva-ventas.component';

describe('ListadoDevolucionIvaVentasComponent', () => {
  let component: ListadoDevolucionIvaVentasComponent;
  let fixture: ComponentFixture<ListadoDevolucionIvaVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDevolucionIvaVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDevolucionIvaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
