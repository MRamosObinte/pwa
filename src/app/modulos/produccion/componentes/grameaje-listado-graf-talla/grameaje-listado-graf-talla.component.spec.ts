import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajeListadoGrafTallaComponent } from './grameaje-listado-graf-talla.component';

describe('GrameajeListadoGrafTallaComponent', () => {
  let component: GrameajeListadoGrafTallaComponent;
  let fixture: ComponentFixture<GrameajeListadoGrafTallaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajeListadoGrafTallaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajeListadoGrafTallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
