import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoConsolidadoAnticiposPrestamosComponent } from './saldo-consolidado-anticipos-prestamos.component';

describe('SaldoConsolidadoAnticiposPrestamosComponent', () => {
  let component: SaldoConsolidadoAnticiposPrestamosComponent;
  let fixture: ComponentFixture<SaldoConsolidadoAnticiposPrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoConsolidadoAnticiposPrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoConsolidadoAnticiposPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
