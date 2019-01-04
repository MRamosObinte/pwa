import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasConsolidadoProductosComponent } from './compras-consolidado-productos.component';

describe('ComprasConsolidadoProductosComponent', () => {
  let component: ComprasConsolidadoProductosComponent;
  let fixture: ComponentFixture<ComprasConsolidadoProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasConsolidadoProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasConsolidadoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
