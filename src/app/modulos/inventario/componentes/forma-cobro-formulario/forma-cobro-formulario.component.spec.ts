import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaCobroFormularioComponent } from './forma-cobro-formulario.component';

describe('FormaCobroFormularioComponent', () => {
  let component: FormaCobroFormularioComponent;
  let fixture: ComponentFixture<FormaCobroFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaCobroFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaCobroFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
