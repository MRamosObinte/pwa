import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProductosComponent } from './formulario-productos.component';

describe('FormularioProductosComponent', () => {
  let component: FormularioProductosComponent;
  let fixture: ComponentFixture<FormularioProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
