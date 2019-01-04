import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesVentasListadoSimpleComponent } from './retenciones-ventas-listado-simple.component';

describe('RetencionesVentasListadoSimpleComponent', () => {
  let component: RetencionesVentasListadoSimpleComponent;
  let fixture: ComponentFixture<RetencionesVentasListadoSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesVentasListadoSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesVentasListadoSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
