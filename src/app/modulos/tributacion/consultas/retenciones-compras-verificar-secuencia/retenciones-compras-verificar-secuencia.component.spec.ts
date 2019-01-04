import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesComprasVerificarSecuenciaComponent } from './retenciones-compras-verificar-secuencia.component';

describe('RetencionesComprasVerificarSecuenciaComponent', () => {
  let component: RetencionesComprasVerificarSecuenciaComponent;
  let fixture: ComponentFixture<RetencionesComprasVerificarSecuenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesComprasVerificarSecuenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesComprasVerificarSecuenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
