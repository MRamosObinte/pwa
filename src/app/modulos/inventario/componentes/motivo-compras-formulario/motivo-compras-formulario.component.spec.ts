import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoComprasFormularioComponent } from './motivo-compras-formulario.component';

describe('MotivoComprasFormularioComponent', () => {
  let component: MotivoComprasFormularioComponent;
  let fixture: ComponentFixture<MotivoComprasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoComprasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoComprasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
