import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilFacturacionListadoComponent } from './perfil-facturacion-listado.component';

describe('PerfilFacturacionListadoComponent', () => {
  let component: PerfilFacturacionListadoComponent;
  let fixture: ComponentFixture<PerfilFacturacionListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilFacturacionListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilFacturacionListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
