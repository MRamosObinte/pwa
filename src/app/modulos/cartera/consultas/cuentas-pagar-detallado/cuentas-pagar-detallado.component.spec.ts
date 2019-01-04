import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasPagarDetalladoComponent } from './cuentas-pagar-detallado.component';

describe('CuentasPagarDetalladoComponent', () => {
  let component: CuentasPagarDetalladoComponent;
  let fixture: ComponentFixture<CuentasPagarDetalladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasPagarDetalladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasPagarDetalladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
