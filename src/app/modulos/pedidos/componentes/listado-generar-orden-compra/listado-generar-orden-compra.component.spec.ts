import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoGenerarOrdenCompraComponent } from './listado-generar-orden-compra.component';

describe('ListadoGenerarOrdenCompraComponent', () => {
  let component: ListadoGenerarOrdenCompraComponent;
  let fixture: ComponentFixture<ListadoGenerarOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoGenerarOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoGenerarOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
