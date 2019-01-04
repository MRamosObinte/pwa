import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasConsolidadoProductosMensualComponent } from './compras-consolidado-productos-mensual.component';

describe('ComprasConsolidadoProductosMensualComponent', () => {
  let component: ComprasConsolidadoProductosMensualComponent;
  let fixture: ComponentFixture<ComprasConsolidadoProductosMensualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasConsolidadoProductosMensualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasConsolidadoProductosMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
