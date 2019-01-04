import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesRentaComprasConsolidadoComponent } from './retenciones-renta-compras-consolidado.component';

describe('RetencionesRentaComprasConsolidadoComponent', () => {
  let component: RetencionesRentaComprasConsolidadoComponent;
  let fixture: ComponentFixture<RetencionesRentaComprasConsolidadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesRentaComprasConsolidadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesRentaComprasConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
