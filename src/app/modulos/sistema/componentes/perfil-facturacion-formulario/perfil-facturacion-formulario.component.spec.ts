import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilFacturacionFormularioComponent } from './perfil-facturacion-formulario.component';

describe('PerfilFacturacionFormularioComponent', () => {
  let component: PerfilFacturacionFormularioComponent;
  let fixture: ComponentFixture<PerfilFacturacionFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilFacturacionFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilFacturacionFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
