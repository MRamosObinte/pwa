import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoResultadoIntegralComparativoComponent } from './estado-resultado-integral-comparativo.component';

describe('EstadoResultadoIntegralComparativoComponent', () => {
  let component: EstadoResultadoIntegralComparativoComponent;
  let fixture: ComponentFixture<EstadoResultadoIntegralComparativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoResultadoIntegralComparativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoResultadoIntegralComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
