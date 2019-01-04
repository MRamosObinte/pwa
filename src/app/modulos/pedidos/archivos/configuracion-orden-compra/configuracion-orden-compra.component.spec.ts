import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionOrdenCompraComponent } from './configuracion-orden-compra.component';

describe('ConfiguracionOrdenCompraComponent', () => {
  let component: ConfiguracionOrdenCompraComponent;
  let fixture: ComponentFixture<ConfiguracionOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
