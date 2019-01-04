import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesIvaComprasComponent } from './retenciones-iva-compras.component';

describe('RetencionesIvaComprasComponent', () => {
  let component: RetencionesIvaComprasComponent;
  let fixture: ComponentFixture<RetencionesIvaComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesIvaComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesIvaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
