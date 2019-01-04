import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiiiSueldoFormularioComponent } from './xiii-sueldo-formulario.component';

describe('XiiiSueldoFormularioComponent', () => {
  let component: XiiiSueldoFormularioComponent;
  let fixture: ComponentFixture<XiiiSueldoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiiiSueldoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiiiSueldoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
