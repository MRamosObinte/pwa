import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoFormularioComponent } from './forma-pago-formulario.component';

describe('FormaPagoFormularioComponent', () => {
  let component: FormaPagoFormularioComponent;
  let fixture: ComponentFixture<FormaPagoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaPagoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
