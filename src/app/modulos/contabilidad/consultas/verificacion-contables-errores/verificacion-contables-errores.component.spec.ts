import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionContablesErroresComponent } from './verificacion-contables-errores.component';

describe('VerificacionContablesErroresComponent', () => {
  let component: VerificacionContablesErroresComponent;
  let fixture: ComponentFixture<VerificacionContablesErroresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificacionContablesErroresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionContablesErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
