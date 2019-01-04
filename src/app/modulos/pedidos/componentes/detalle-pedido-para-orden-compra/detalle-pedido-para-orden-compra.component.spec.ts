import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePedidoParaOrdenCompraComponent } from './detalle-pedido-para-orden-compra.component';

describe('DetallePedidoParaOrdenCompraComponent', () => {
  let component: DetallePedidoParaOrdenCompraComponent;
  let fixture: ComponentFixture<DetallePedidoParaOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePedidoParaOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePedidoParaOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
