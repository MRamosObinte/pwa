import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SobrevivenciaFormularioComponent } from './sobrevivencia-formulario.component';

describe('SobrevivenciaFormularioComponent', () => {
  let component: SobrevivenciaFormularioComponent;
  let fixture: ComponentFixture<SobrevivenciaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SobrevivenciaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SobrevivenciaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
