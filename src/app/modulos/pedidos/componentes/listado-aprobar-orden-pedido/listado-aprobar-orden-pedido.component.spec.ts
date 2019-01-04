import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAprobarOrdenPedidoComponent } from './listado-aprobar-orden-pedido.component';

describe('ListadoAprobarOrdenPedidoComponent', () => {
  let component: ListadoAprobarOrdenPedidoComponent;
  let fixture: ComponentFixture<ListadoAprobarOrdenPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAprobarOrdenPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAprobarOrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
