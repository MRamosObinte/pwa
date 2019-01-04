import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscinaListadoComponent } from './piscina-listado.component';

describe('PiscinaListadoComponent', () => {
  let component: PiscinaListadoComponent;
  let fixture: ComponentFixture<PiscinaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiscinaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscinaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
