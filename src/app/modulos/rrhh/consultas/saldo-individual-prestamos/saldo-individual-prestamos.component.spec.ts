import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoIndividualPrestamosComponent } from './saldo-individual-prestamos.component';

describe('SaldoIndividualPrestamosComponent', () => {
  let component: SaldoIndividualPrestamosComponent;
  let fixture: ComponentFixture<SaldoIndividualPrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoIndividualPrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoIndividualPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
