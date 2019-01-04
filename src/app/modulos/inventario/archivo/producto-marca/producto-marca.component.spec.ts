import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoMarcaComponent } from './producto-marca.component';

describe('ProductoMarcaComponent', () => {
  let component: ProductoMarcaComponent;
  let fixture: ComponentFixture<ProductoMarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoMarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
