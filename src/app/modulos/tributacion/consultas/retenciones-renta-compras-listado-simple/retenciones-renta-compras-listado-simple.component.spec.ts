import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesRentaComprasListadoSimpleComponent } from './retenciones-renta-compras-listado-simple.component';

describe('RetencionesRentaComprasListadoSimpleComponent', () => {
  let component: RetencionesRentaComprasListadoSimpleComponent;
  let fixture: ComponentFixture<RetencionesRentaComprasListadoSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesRentaComprasListadoSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesRentaComprasListadoSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
