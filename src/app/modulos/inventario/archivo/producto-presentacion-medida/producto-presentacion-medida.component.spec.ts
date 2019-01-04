import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoPresentacionMedidaComponent } from './producto-presentacion-medida.component';

describe('ProductoPresentacionMedidaComponent', () => {
  let component: ProductoPresentacionMedidaComponent;
  let fixture: ComponentFixture<ProductoPresentacionMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoPresentacionMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoPresentacionMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
