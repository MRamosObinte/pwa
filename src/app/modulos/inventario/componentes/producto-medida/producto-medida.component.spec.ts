import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoMedidaComponent } from './producto-medida.component';

describe('ProductoMedidaComponent', () => {
  let component: ProductoMedidaComponent;
  let fixture: ComponentFixture<ProductoMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
