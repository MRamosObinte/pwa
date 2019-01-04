import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoProductosPreciosStockComponent } from './listado-productos-precios-stock.component';

describe('ListadoProductosPreciosStockComponent', () => {
  let component: ListadoProductosPreciosStockComponent;
  let fixture: ComponentFixture<ListadoProductosPreciosStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoProductosPreciosStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoProductosPreciosStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
