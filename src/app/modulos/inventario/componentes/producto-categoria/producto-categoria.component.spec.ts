import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCategoriaComponent } from './producto-categoria.component';

describe('ProductoCategoriaComponent', () => {
  let component: ProductoCategoriaComponent;
  let fixture: ComponentFixture<ProductoCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
