import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldosConsolidadosBonosListadoComponent } from './saldos-consolidados-bonos-listado.component';

describe('SaldosConsolidadosBonosListadoComponent', () => {
  let component: SaldosConsolidadosBonosListadoComponent;
  let fixture: ComponentFixture<SaldosConsolidadosBonosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldosConsolidadosBonosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldosConsolidadosBonosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
