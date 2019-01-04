import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoTipoComponent } from './producto-tipo.component';

describe('ProductoTipoComponent', () => {
  let component: ProductoTipoComponent;
  let fixture: ComponentFixture<ProductoTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
