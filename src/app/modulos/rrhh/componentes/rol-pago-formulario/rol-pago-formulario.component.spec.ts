import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolPagoFormularioComponent } from './rol-pago-formulario.component';

describe('RolPagoFormularioComponent', () => {
  let component: RolPagoFormularioComponent;
  let fixture: ComponentFixture<RolPagoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolPagoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolPagoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
