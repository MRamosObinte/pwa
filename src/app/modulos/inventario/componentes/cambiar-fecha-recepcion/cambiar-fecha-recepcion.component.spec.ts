import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarFechaRecepcionComponent } from './cambiar-fecha-recepcion.component';

describe('CambiarFechaRecepcionComponent', () => {
  let component: CambiarFechaRecepcionComponent;
  let fixture: ComponentFixture<CambiarFechaRecepcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiarFechaRecepcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarFechaRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
