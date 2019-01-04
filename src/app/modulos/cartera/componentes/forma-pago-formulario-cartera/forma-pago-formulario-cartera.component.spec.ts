import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoFormularioCarteraComponent } from './forma-pago-formulario-cartera.component';

describe('FormaPagoFormularioCarteraComponent', () => {
  let component: FormaPagoFormularioCarteraComponent;
  let fixture: ComponentFixture<FormaPagoFormularioCarteraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagoFormularioCarteraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaPagoFormularioCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
