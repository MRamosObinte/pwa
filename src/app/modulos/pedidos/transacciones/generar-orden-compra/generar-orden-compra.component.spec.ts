import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarOrdenCompraComponent } from './generar-orden-compra.component';

describe('GenerarOrdenCompraComponent', () => {
  let component: GenerarOrdenCompraComponent;
  let fixture: ComponentFixture<GenerarOrdenCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarOrdenCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
