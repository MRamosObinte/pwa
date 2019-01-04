import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorAuxiliarFormularioComponent } from './mayor-auxiliar-formulario.component';

describe('MayorAuxiliarFormularioComponent', () => {
  let component: MayorAuxiliarFormularioComponent;
  let fixture: ComponentFixture<MayorAuxiliarFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MayorAuxiliarFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MayorAuxiliarFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
