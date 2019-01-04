import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoProformasFormularioComponent } from './motivo-proformas-formulario.component';

describe('MotivoProformasFormularioComponent', () => {
  let component: MotivoProformasFormularioComponent;
  let fixture: ComponentFixture<MotivoProformasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoProformasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoProformasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
