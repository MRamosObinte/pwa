import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAnticiposPrestamosListadoComponent } from './detalle-anticipos-prestamos-listado.component';

describe('DetalleAnticiposPrestamosListadoComponent', () => {
  let component: DetalleAnticiposPrestamosListadoComponent;
  let fixture: ComponentFixture<DetalleAnticiposPrestamosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAnticiposPrestamosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAnticiposPrestamosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
