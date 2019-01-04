import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasCobrarGeneralComponent } from './cuentas-cobrar-general.component';

describe('CuentasCobrarGeneralComponent', () => {
  let component: CuentasCobrarGeneralComponent;
  let fixture: ComponentFixture<CuentasCobrarGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasCobrarGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasCobrarGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
