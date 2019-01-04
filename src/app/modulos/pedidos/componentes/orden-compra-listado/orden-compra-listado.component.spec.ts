import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCompraListadoComponent } from './orden-compra-listado.component';

describe('OrdenCompraListadoComponent', () => {
  let component: OrdenCompraListadoComponent;
  let fixture: ComponentFixture<OrdenCompraListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenCompraListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCompraListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
