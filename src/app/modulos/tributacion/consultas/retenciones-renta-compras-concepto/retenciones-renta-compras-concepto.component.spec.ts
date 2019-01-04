import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesRentaComprasConceptoComponent } from './retenciones-renta-compras-concepto.component';

describe('RetencionesRentaComprasConceptoComponent', () => {
  let component: RetencionesRentaComprasConceptoComponent;
  let fixture: ComponentFixture<RetencionesRentaComprasConceptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesRentaComprasConceptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesRentaComprasConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
