import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajeListadoGrafBiomasaComponent } from './grameaje-listado-graf-biomasa.component';

describe('GrameajeListadoGrafBiomasaComponent', () => {
  let component: GrameajeListadoGrafBiomasaComponent;
  let fixture: ComponentFixture<GrameajeListadoGrafBiomasaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajeListadoGrafBiomasaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajeListadoGrafBiomasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
