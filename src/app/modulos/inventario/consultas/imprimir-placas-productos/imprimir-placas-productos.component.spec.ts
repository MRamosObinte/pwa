import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirPlacasProductosComponent } from './imprimir-placas-productos.component';

describe('ImprimirPlacasProductosComponent', () => {
  let component: ImprimirPlacasProductosComponent;
  let fixture: ComponentFixture<ImprimirPlacasProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirPlacasProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirPlacasProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
