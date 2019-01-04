import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoFormularioComponent } from './prestamo-formulario.component';

describe('PrestamoFormularioComponent', () => {
  let component: PrestamoFormularioComponent;
  let fixture: ComponentFixture<PrestamoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestamoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
