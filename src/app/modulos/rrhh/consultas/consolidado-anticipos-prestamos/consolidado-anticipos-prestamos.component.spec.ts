import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoAnticiposPrestamosComponent } from './consolidado-anticipos-prestamos.component';

describe('ConsolidadoAnticiposPrestamosComponent', () => {
  let component: ConsolidadoAnticiposPrestamosComponent;
  let fixture: ComponentFixture<ConsolidadoAnticiposPrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidadoAnticiposPrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidadoAnticiposPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
