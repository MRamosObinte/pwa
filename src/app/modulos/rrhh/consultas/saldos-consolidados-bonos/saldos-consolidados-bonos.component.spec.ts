import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldosConsolidadosBonosComponent } from './saldos-consolidados-bonos.component';

describe('SaldosConsolidadosBonosComponent', () => {
  let component: SaldosConsolidadosBonosComponent;
  let fixture: ComponentFixture<SaldosConsolidadosBonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldosConsolidadosBonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldosConsolidadosBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
