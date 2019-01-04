import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoBodegaComprobacionMontosComponent } from './saldo-bodega-comprobacion-montos.component';

describe('SaldoBodegaComprobacionMontosComponent', () => {
  let component: SaldoBodegaComprobacionMontosComponent;
  let fixture: ComponentFixture<SaldoBodegaComprobacionMontosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoBodegaComprobacionMontosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoBodegaComprobacionMontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
