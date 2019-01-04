import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoClasificacionComponent } from './grupo-clasificacion.component';

describe('GrupoClasificacionComponent', () => {
  let component: GrupoClasificacionComponent;
  let fixture: ComponentFixture<GrupoClasificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoClasificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoClasificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
