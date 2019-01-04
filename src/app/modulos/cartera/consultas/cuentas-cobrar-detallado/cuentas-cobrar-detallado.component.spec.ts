import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasCobrarDetalladoComponent } from './cuentas-cobrar-detallado.component';

describe('CuentasCobrarDetalladoComponent', () => {
  let component: CuentasCobrarDetalladoComponent;
  let fixture: ComponentFixture<CuentasCobrarDetalladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasCobrarDetalladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasCobrarDetalladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
