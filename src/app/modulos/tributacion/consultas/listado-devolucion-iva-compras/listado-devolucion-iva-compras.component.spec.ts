import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDevolucionIvaComprasComponent } from './listado-devolucion-iva-compras.component';

describe('ListadoDevolucionIvaComprasComponent', () => {
  let component: ListadoDevolucionIvaComprasComponent;
  let fixture: ComponentFixture<ListadoDevolucionIvaComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDevolucionIvaComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDevolucionIvaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
