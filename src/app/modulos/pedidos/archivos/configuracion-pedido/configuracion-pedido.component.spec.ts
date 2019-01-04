import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionPedidoComponent } from './configuracion-pedido.component';

describe('ConfiguracionPedidoComponent', () => {
  let component: ConfiguracionPedidoComponent;
  let fixture: ComponentFixture<ConfiguracionPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
