import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaCobroFormularioCarteraComponent } from './forma-cobro-formulario-cartera.component';

describe('FormaCobroFormularioCarteraComponent', () => {
  let component: FormaCobroFormularioCarteraComponent;
  let fixture: ComponentFixture<FormaCobroFormularioCarteraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaCobroFormularioCarteraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaCobroFormularioCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
