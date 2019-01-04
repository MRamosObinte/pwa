import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoFormularioComponent } from './consumo-formulario.component';

describe('ConsumoFormularioComponent', () => {
  let component: ConsumoFormularioComponent;
  let fixture: ComponentFixture<ConsumoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
