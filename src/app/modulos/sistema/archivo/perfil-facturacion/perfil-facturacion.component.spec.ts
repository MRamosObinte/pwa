import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilFacturacionComponent } from './perfil-facturacion.component';

describe('PerfilFacturacionComponent', () => {
  let component: PerfilFacturacionComponent;
  let fixture: ComponentFixture<PerfilFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
