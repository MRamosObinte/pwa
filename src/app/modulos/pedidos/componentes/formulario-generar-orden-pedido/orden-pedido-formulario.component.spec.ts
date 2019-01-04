import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenPedidoFormularioComponent } from './orden-pedido-formulario.component';

describe('OrdenPedidoFormularioComponent', () => {
  let component: OrdenPedidoFormularioComponent;
  let fixture: ComponentFixture<OrdenPedidoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenPedidoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenPedidoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
