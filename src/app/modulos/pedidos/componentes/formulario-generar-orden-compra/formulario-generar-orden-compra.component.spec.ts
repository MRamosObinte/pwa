import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioGenerarOrdenCompraComponent } from './formulario-generar-orden-compra.component';

describe('FormularioGenerarOrdenCompraComponent', () => {
  let component: FormularioGenerarOrdenCompraComponent;
  let fixture: ComponentFixture<FormularioGenerarOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioGenerarOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioGenerarOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
