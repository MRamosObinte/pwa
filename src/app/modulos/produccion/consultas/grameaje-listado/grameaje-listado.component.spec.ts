import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajeListadoComponent } from './grameaje-listado.component';

describe('GrameajeListadoComponent', () => {
  let component: GrameajeListadoComponent;
  let fixture: ComponentFixture<GrameajeListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajeListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajeListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
