import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContableRrhhFormularioComponent } from './contable-rrhh-formulario.component';

describe('ContableRrhhFormularioComponent', () => {
  let component: ContableRrhhFormularioComponent;
  let fixture: ComponentFixture<ContableRrhhFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContableRrhhFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContableRrhhFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
