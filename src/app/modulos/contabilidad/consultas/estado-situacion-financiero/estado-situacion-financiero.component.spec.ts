import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoSituacionFinancieroComponent } from './estado-situacion-financiero.component';

describe('EstadoSituacionFinancieroComponent', () => {
  let component: EstadoSituacionFinancieroComponent;
  let fixture: ComponentFixture<EstadoSituacionFinancieroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoSituacionFinancieroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoSituacionFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
