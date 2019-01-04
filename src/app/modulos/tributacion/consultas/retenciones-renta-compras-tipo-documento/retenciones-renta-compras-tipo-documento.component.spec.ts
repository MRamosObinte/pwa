import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesRentaComprasTipoDocumentoComponent } from './retenciones-renta-compras-tipo-documento.component';

describe('RetencionesRentaComprasTipoDocumentoComponent', () => {
  let component: RetencionesRentaComprasTipoDocumentoComponent;
  let fixture: ComponentFixture<RetencionesRentaComprasTipoDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesRentaComprasTipoDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesRentaComprasTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
