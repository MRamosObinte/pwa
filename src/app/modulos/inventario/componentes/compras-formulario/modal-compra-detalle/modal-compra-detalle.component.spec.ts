import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCompraDetalleComponent } from './modal-compra-detalle.component';

describe('ModalCompraDetalleComponent', () => {
  let component: ModalCompraDetalleComponent;
  let fixture: ComponentFixture<ModalCompraDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCompraDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCompraDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
