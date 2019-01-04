import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaFormularioComponent } from './categoria-formulario.component';

describe('CategoriaFormularioComponent', () => {
  let component: CategoriaFormularioComponent;
  let fixture: ComponentFixture<CategoriaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
