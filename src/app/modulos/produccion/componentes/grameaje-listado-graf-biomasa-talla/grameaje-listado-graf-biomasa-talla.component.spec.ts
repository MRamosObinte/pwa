import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajeListadoGrafBiomasaTallaComponent } from './grameaje-listado-graf-biomasa-talla.component';

describe('GrameajeListadoGrafBiomasaTallaComponent', () => {
  let component: GrameajeListadoGrafBiomasaTallaComponent;
  let fixture: ComponentFixture<GrameajeListadoGrafBiomasaTallaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajeListadoGrafBiomasaTallaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajeListadoGrafBiomasaTallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
