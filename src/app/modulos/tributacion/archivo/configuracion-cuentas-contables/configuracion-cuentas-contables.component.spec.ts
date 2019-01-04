import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCuentasContablesComponent } from './configuracion-cuentas-contables.component';

describe('ConfiguracionCuentasContablesComponent', () => {
  let component: ConfiguracionCuentasContablesComponent;
  let fixture: ComponentFixture<ConfiguracionCuentasContablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionCuentasContablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionCuentasContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
