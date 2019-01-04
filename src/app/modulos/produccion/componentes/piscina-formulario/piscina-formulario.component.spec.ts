import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscinaFormularioComponent } from './piscina-formulario.component';

describe('PiscinaFormularioComponent', () => {
  let component: PiscinaFormularioComponent;
  let fixture: ComponentFixture<PiscinaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiscinaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscinaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
