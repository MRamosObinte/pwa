import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasFormularioComponent } from './cuentas-formulario.component';

describe('CuentasFormularioComponent', () => {
  let component: CuentasFormularioComponent;
  let fixture: ComponentFixture<CuentasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
