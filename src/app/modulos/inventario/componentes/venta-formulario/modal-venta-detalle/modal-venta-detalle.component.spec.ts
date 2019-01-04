import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVentaDetalleComponent } from './modal-venta-detalle.component';

describe('ModalVentaDetalleComponent', () => {
  let component: ModalVentaDetalleComponent;
  let fixture: ComponentFixture<ModalVentaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVentaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVentaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
