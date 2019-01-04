import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioAuxiliarCuentasComponent } from './diario-auxiliar-cuentas.component';

describe('DiarioAuxiliarCuentasComponent', () => {
  let component: DiarioAuxiliarCuentasComponent;
  let fixture: ComponentFixture<DiarioAuxiliarCuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioAuxiliarCuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioAuxiliarCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
