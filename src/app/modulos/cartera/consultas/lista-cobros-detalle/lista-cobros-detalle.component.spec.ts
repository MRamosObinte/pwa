import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCobrosDetalleComponent } from './lista-cobros-detalle.component';

describe('ListaCobrosDetalleComponent', () => {
  let component: ListaCobrosDetalleComponent;
  let fixture: ComponentFixture<ListaCobrosDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCobrosDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCobrosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
