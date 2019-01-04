import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoConsolidadoSueldoPagarComponent } from './saldo-consolidado-sueldo-pagar.component';

describe('SaldoConsolidadoSueldoPagarComponent', () => {
  let component: SaldoConsolidadoSueldoPagarComponent;
  let fixture: ComponentFixture<SaldoConsolidadoSueldoPagarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoConsolidadoSueldoPagarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoConsolidadoSueldoPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
