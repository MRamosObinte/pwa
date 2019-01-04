import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFormularioComponent } from './compras-formulario.component';

describe('ComprasFormularioComponent', () => {
  let component: ComprasFormularioComponent;
  let fixture: ComponentFixture<ComprasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
