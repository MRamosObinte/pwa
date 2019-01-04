import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosListadoCompraComponent } from './pagos-listado-compra.component';

describe('PagosListadoCompraComponent', () => {
  let component: PagosListadoCompraComponent;
  let fixture: ComponentFixture<PagosListadoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosListadoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosListadoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
