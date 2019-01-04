import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPescaFormularioComponent } from './productos-pesca-formulario.component';

describe('ProductosPescaFormularioComponent', () => {
  let component: ProductosPescaFormularioComponent;
  let fixture: ComponentFixture<ProductosPescaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosPescaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosPescaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
