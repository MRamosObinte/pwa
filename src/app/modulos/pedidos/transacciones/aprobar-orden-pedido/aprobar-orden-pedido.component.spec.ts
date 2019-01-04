import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarOrdenPedidoComponent } from './aprobar-orden-pedido.component';

describe('AprobarOrdenPedidoComponent', () => {
  let component: AprobarOrdenPedidoComponent;
  let fixture: ComponentFixture<AprobarOrdenPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarOrdenPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarOrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
