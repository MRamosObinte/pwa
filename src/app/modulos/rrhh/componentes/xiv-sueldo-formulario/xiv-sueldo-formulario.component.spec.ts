import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XivSueldoFormularioComponent } from './xiv-sueldo-formulario.component';

describe('XivSueldoFormularioComponent', () => {
  let component: XivSueldoFormularioComponent;
  let fixture: ComponentFixture<XivSueldoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XivSueldoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XivSueldoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
