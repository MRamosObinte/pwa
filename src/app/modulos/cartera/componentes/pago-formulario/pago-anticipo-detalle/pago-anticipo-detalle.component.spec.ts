import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoAnticipoDetalleComponent } from './pago-anticipo-detalle.component';

describe('PagoAnticipoDetalleComponent', () => {
  let component: PagoAnticipoDetalleComponent;
  let fixture: ComponentFixture<PagoAnticipoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoAnticipoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoAnticipoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
