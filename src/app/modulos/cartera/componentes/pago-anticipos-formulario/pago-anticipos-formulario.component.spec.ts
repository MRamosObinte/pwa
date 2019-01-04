import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoAnticiposFormularioComponent } from './pago-anticipos-formulario.component';

describe('PagoAnticiposFormularioComponent', () => {
  let component: PagoAnticiposFormularioComponent;
  let fixture: ComponentFixture<PagoAnticiposFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoAnticiposFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoAnticiposFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
