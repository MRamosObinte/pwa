import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoAnticiposPrestamosListadoComponent } from './consolidado-anticipos-prestamos-listado.component';

describe('ConsolidadoAnticiposPrestamosListadoComponent', () => {
  let component: ConsolidadoAnticiposPrestamosListadoComponent;
  let fixture: ComponentFixture<ConsolidadoAnticiposPrestamosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidadoAnticiposPrestamosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoAnticiposPrestamosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
