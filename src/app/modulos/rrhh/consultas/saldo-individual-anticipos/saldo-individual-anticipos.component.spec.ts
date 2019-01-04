import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoIndividualAnticiposComponent } from './saldo-individual-anticipos.component';

describe('SaldoIndividualAnticiposComponent', () => {
  let component: SaldoIndividualAnticiposComponent;
  let fixture: ComponentFixture<SaldoIndividualAnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoIndividualAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoIndividualAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
