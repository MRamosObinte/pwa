import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoPresentacionCajasComponent } from './producto-presentacion-cajas.component';

describe('ProductoPresentacionCajasComponent', () => {
  let component: ProductoPresentacionCajasComponent;
  let fixture: ComponentFixture<ProductoPresentacionCajasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoPresentacionCajasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoPresentacionCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
