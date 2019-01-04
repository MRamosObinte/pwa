import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosConsultaComponent } from './empleados-consulta.component';

describe('EmpleadosConsultaComponent', () => {
  let component: EmpleadosConsultaComponent;
  let fixture: ComponentFixture<EmpleadosConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadosConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
