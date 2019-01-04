import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosListadoVentasComponent } from './cobros-listado-ventas.component';

describe('CobrosListadoVentasComponent', () => {
  let component: CobrosListadoVentasComponent;
  let fixture: ComponentFixture<CobrosListadoVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrosListadoVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosListadoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
