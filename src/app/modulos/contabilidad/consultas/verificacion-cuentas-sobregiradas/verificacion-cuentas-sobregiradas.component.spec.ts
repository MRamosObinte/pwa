import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionCuentasSobregiradasComponent } from './verificacion-cuentas-sobregiradas.component';

describe('VerificacionCuentasSobregiradasComponent', () => {
  let component: VerificacionCuentasSobregiradasComponent;
  let fixture: ComponentFixture<VerificacionCuentasSobregiradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificacionCuentasSobregiradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionCuentasSobregiradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
