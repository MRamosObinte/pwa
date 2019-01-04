import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosFormularioComponent } from './empleados-formulario.component';

describe('EmpleadosFormularioComponent', () => {
  let component: EmpleadosFormularioComponent;
  let fixture: ComponentFixture<EmpleadosFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadosFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
