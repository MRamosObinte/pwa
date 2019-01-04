import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasPagarGeneralComponent } from './cuentas-pagar-general.component';

describe('CuentasPagarGeneralComponent', () => {
  let component: CuentasPagarGeneralComponent;
  let fixture: ComponentFixture<CuentasPagarGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasPagarGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasPagarGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
