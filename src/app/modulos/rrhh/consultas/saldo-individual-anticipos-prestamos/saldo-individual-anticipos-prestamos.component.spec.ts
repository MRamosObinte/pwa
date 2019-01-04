import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoIndividualAnticiposPrestamosComponent } from './saldo-individual-anticipos-prestamos.component';

describe('SaldoIndividualAnticiposPrestamosComponent', () => {
  let component: SaldoIndividualAnticiposPrestamosComponent;
  let fixture: ComponentFixture<SaldoIndividualAnticiposPrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoIndividualAnticiposPrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoIndividualAnticiposPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
