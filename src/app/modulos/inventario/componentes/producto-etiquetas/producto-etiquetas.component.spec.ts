import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoEtiquetasComponent } from './producto-etiquetas.component';

describe('ProductoEtiquetasComponent', () => {
  let component: ProductoEtiquetasComponent;
  let fixture: ComponentFixture<ProductoEtiquetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoEtiquetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoEtiquetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
