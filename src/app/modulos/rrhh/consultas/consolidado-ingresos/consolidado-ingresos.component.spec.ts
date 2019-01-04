import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoIngresosComponent } from './consolidado-ingresos.component';

describe('ConsolidadoIngresosComponent', () => {
  let component: ConsolidadoIngresosComponent;
  let fixture: ComponentFixture<ConsolidadoIngresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidadoIngresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
