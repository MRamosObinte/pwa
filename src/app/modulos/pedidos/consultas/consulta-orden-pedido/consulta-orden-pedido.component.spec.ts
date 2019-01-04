import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaOrdenPedidoComponent } from './consulta-orden-pedido.component';

describe('ConsultaOrdenPedidoComponent', () => {
  let component: ConsultaOrdenPedidoComponent;
  let fixture: ComponentFixture<ConsultaOrdenPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaOrdenPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaOrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
