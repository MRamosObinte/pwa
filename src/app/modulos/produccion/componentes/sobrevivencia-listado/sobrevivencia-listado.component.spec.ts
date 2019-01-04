import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SobrevivenciaListadoComponent } from './sobrevivencia-listado.component';

describe('SobrevivenciaListadoComponent', () => {
  let component: SobrevivenciaListadoComponent;
  let fixture: ComponentFixture<SobrevivenciaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SobrevivenciaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SobrevivenciaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
