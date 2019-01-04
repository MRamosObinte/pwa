import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoOrdenPedidoComponent } from './listado-orden-pedido.component';

describe('ListadoOrdenPedidoComponent', () => {
  let component: ListadoOrdenPedidoComponent;
  let fixture: ComponentFixture<ListadoOrdenPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoOrdenPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoOrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
