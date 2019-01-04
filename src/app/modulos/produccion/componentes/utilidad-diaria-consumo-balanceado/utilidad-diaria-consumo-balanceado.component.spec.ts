import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilidadDiariaConsumoBalanceadoComponent } from './utilidad-diaria-consumo-balanceado.component';

describe('UtilidadDiariaConsumoBalanceadoComponent', () => {
  let component: UtilidadDiariaConsumoBalanceadoComponent;
  let fixture: ComponentFixture<UtilidadDiariaConsumoBalanceadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilidadDiariaConsumoBalanceadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilidadDiariaConsumoBalanceadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
