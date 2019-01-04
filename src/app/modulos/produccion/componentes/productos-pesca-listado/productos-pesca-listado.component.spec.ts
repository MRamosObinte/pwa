import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPescaListadoComponent } from './productos-pesca-listado.component';

describe('ProductosPescaListadoComponent', () => {
  let component: ProductosPescaListadoComponent;
  let fixture: ComponentFixture<ProductosPescaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosPescaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosPescaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
