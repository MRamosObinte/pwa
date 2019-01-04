import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorFormularioComponent } from './proveedor-formulario.component';

describe('ProveedorFormularioComponent', () => {
  let component: ProveedorFormularioComponent;
  let fixture: ComponentFixture<ProveedorFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedorFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
