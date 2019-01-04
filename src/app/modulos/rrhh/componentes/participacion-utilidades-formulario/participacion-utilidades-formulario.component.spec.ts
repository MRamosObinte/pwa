import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacionUtilidadesFormularioComponent } from './participacion-utilidades-formulario.component';

describe('ParticipacionUtilidadesFormularioComponent', () => {
  let component: ParticipacionUtilidadesFormularioComponent;
  let fixture: ComponentFixture<ParticipacionUtilidadesFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipacionUtilidadesFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipacionUtilidadesFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
