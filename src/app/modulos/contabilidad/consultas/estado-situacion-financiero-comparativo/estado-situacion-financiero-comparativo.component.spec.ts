import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoSituacionFinancieroComparativoComponent } from './estado-situacion-financiero-comparativo.component';

describe('EstadoSituacionFinancieroComparativoComponent', () => {
  let component: EstadoSituacionFinancieroComparativoComponent;
  let fixture: ComponentFixture<EstadoSituacionFinancieroComparativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoSituacionFinancieroComparativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoSituacionFinancieroComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
