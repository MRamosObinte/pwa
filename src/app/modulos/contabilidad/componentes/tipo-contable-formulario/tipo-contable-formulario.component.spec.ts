import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoContableFormularioComponent } from './tipo-contable-formulario.component';

describe('TipoContableFormularioComponent', () => {
  let component: TipoContableFormularioComponent;
  let fixture: ComponentFixture<TipoContableFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoContableFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoContableFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
