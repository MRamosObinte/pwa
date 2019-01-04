import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarOrdenPedidoFormularioComponent } from './aprobar-orden-pedido-formulario.component';

describe('AprobarOrdenPedidoFormularioComponent', () => {
  let component: AprobarOrdenPedidoFormularioComponent;
  let fixture: ComponentFixture<AprobarOrdenPedidoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarOrdenPedidoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarOrdenPedidoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
