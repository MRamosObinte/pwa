import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoBeneficiosComponent } from './forma-pago-beneficios.component';

describe('FormaPagoBeneficiosComponent', () => {
  let component: FormaPagoBeneficiosComponent;
  let fixture: ComponentFixture<FormaPagoBeneficiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagoBeneficiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaPagoBeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
