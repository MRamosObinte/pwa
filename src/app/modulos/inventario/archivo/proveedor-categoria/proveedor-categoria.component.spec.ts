import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorCategoriaComponent } from './proveedor-categoria.component';

describe('ProveedorCategoriaComponent', () => {
  let component: ProveedorCategoriaComponent;
  let fixture: ComponentFixture<ProveedorCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedorCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
