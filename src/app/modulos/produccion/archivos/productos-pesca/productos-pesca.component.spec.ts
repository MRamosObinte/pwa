import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPescaComponent } from './productos-pesca.component';

describe('ProductosPescaComponent', () => {
  let component: ProductosPescaComponent;
  let fixture: ComponentFixture<ProductosPescaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosPescaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
