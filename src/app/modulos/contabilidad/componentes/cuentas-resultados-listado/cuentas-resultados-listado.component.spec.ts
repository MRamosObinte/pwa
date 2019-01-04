import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasResultadosListadoComponent } from './cuentas-resultados-listado.component';

describe('CuentasResultadosListadoComponent', () => {
  let component: CuentasResultadosListadoComponent;
  let fixture: ComponentFixture<CuentasResultadosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasResultadosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasResultadosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
